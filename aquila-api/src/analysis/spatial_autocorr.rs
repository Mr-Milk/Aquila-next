use std::collections::HashMap;
use itertools::min;
use nalgebra_sparse::CsrMatrix;
use nalgebra_sparse::ops::Op;
use nalgebra_sparse::ops::serial::{spadd_csr_prealloc, spadd_pattern};
use ndarray::prelude::*;
use ndarray::Array;

use crate::analysis::zscore2pvalue;

// Acquire spatial weights matrix from neighbors relationships
pub fn spatial_weights_sparse_matrix(neighbors: Vec<Vec<usize>>, labels: Vec<usize>)
                                     -> (usize, Vec<usize>, Vec<usize>, Vec<usize>, Vec<f64>)
// (shape_n, indptr, indice (or called `col_index`), row_index, data)
{
    let n = neighbors.len();
    let min_offset = min(labels).unwrap();
    let mut ptr: usize = 0;
    let mut indptr = vec![0];
    let mut indice = vec![]; // col_index
    let mut row_index = vec![];
    let mut data: Vec<f64> = vec![];
    for (ix, neighs) in neighbors.into_iter().enumerate() {
        let nn = neighs.len();
        let mut neighs: Vec<usize> = neighs.into_iter().map(|j| j - min_offset).collect();
        neighs.sort();
        let weights = 1.0 / (nn as f64);
        neighs.into_iter().for_each(|i| {
            row_index.push(ix);
            indice.push(i);
            data.push(weights);
        });
        ptr += nn;
        indptr.push(ptr);
    };
    (n, indptr, indice, row_index, data)
}

#[derive(Clone)]
pub struct SpatialWeight {
    pub row_index: Vec<usize>,
    pub col_index: Vec<usize>,
    pub w_sum: f64,
    pub s1: f64,
    pub s2: f64,
    pub s02: f64,
    pub w_sparse: CsrMatrix<f64>,
}

impl SpatialWeight {
    pub fn from_neighbors(neighbors: Vec<Vec<usize>>, labels: Vec<usize>) -> Self {
        let (n, indptr, indice, row_index, data) = spatial_weights_sparse_matrix(neighbors, labels);
        let w_sum = data.iter().sum();
        let w_sparse = CsrMatrix::try_from_csr_data(n, n, indptr, indice.to_owned(), data).unwrap();
        let w1_pattern = spadd_pattern(w_sparse.pattern(), w_sparse.transpose().pattern());
        let w1_len = w1_pattern.nnz();
        let mut w1 = CsrMatrix::try_from_pattern_and_values(w1_pattern, vec![0.0; w1_len]).unwrap();
        spadd_csr_prealloc(1.0, &mut w1, 1.0, Op::NoOp(&w_sparse)).unwrap();
        spadd_csr_prealloc(1.0, &mut w1, 1.0, Op::Transpose(&w_sparse)).unwrap();
        let w1_data: Array1<f64> = w1.values().iter().map(|i| *i).collect();
        let s1 = (&w1_data * &w1_data).sum() / 2.0;
        let w_sum0: Array1<f64> = w_sparse.transpose().row_iter().map(|row| row.values().iter().fold(0.0, |acc, a| acc + *a)).collect();
        let w_sum1: Array1<f64> = w_sparse.row_iter().map(|row| row.values().iter().fold(0.0, |acc, a| acc + *a)).collect();
        let s2 = (&w_sum0 + &w_sum1).mapv(|a| a.powi(2)).sum();
        let s02 = w_sum * w_sum;

        SpatialWeight {
            row_index,
            col_index: indice,
            w_sum,
            s1,
            s2,
            s02,
            w_sparse,
        }
    }

    pub fn wx_i(&self, z: Array1<f64>) -> f64 {
        let w: Array1<f64> = self.w_sparse.row_iter().map(|row| {
            let pz: Array1<f64> = row.col_indices().iter().map(|i| z[*i]).collect();
            let r = Array::from(row.values().to_vec());
            (&r * &pz).sum()
        }).collect();
        (&w * &z).sum()
    }

    pub fn wx_c(&self, z: Array1<f64>) -> f64 {
        let w: Array1<f64> = Array::from_vec(self.w_sparse.values().to_vec());
        let z_row: Array1<f64> = self.row_index.iter().map(|i| z[*i]).collect();
        let z_col: Array1<f64> = self.col_index.iter().map(|i| z[*i]).collect();
        (&w * (&z_row - &z_col).mapv(|a| a.powi(2))).sum()
    }
}

pub fn moran_i_index(x: ArrayView1<f64>, w: SpatialWeight, two_tailed: bool, pval: f64) -> (f64, f64, f64)
{
    let n: f64 = x.len() as f64;
    let s0 = w.w_sum;
    let s1 = w.s1;
    let s2 = w.s2;
    let s02 = w.s02;

    let mean_x = x.mean().unwrap();
    let z = x.to_owned() - mean_x;
    let z2ss = (&z * &z).sum();

    let wx: f64 = w.wx_i(z);
    let i_value = (n / s0) * (wx / z2ss);

    let ei = -1.0 / (n - 1.0);

    let n2 = n * n;
    let v_num = n2 * s1 - n * s2 + 3.0 * s02;
    let v_den = (n - 1.0) * (n + 1.0) * s02;
    let vi_norm = v_num / v_den - (1.0 / (n - 1.0)).powi(2);
    let se_i_norm = vi_norm.powf(1.0 / 2.0);
    let z_norm = (i_value - ei) / se_i_norm;
    let p_norm = zscore2pvalue(z_norm, two_tailed);
    let pattern: f64 = if p_norm < pval { (i_value - ei).signum() } else { 0.0 };
    (pattern, i_value, p_norm)
}

pub fn geary_c_index(x: ArrayView1<f64>, w: SpatialWeight, pval: f64) -> (f64, f64, f64) {
    let n: f64 = x.len() as f64;
    let s1 = w.s1;
    let s2 = w.s2;
    let s02 = w.s02;

    let mean_x = x.mean().unwrap();
    let z = x.to_owned() - mean_x;
    let z2ss = (&z * &z).sum();
    let den = z2ss * w.w_sum * 2.0;

    let wx: f64 = w.wx_c(z);
    let c_value = (n - 1.0) * wx / den;

    // let s0 = w_sum;
    // let w1 = &w + &w.t();
    // let s1 = ((&w1 * &w1).sum() / 2) as f64;
    // let s2 = (&w.sum_axis(Axis(1)) + &w.sum_axis(Axis(0)).t())
    //     .mapv_into(|a: usize| a.pow(2))
    //     .sum() as f64;
    // let s02 = s0 * s0;
    // let n2 = n * n;
    // let z4 = &z.mapv_into(|a: f64| a.powi(4));
    // let z2 = &z.mapv_into(|a: f64| a.powi(2));
    // let k = (z4.sum() / n) / (z2.sum() / n).powi(2);
    // let A: f64 = (n - 1.0) * s1 * (n2 - 3.0 * n - 6.0 - (n2 - n + 2.0) * k);
    // let B: f64 = (1.0 / 4.0) * ((n - 1.0) * s2 * (n2 + 3.0 * n - 6.0 - (n2 - n + 2.0) * k));
    // let C: f64 = s02 * (n2 - 3.0 - (n - 1.0).powi(2) * k);
    let vc_norm = (1.0 / (2.0 * (n + 1.0) * s02)) *
        ((2.0 * s1 + s2) * (n - 1.0) - 4.0 * s02);
    let se_c_norm = vc_norm.powf(0.5);

    let de = c_value - 1.0;
    let z_norm = de / se_c_norm;
    let p_norm = zscore2pvalue(z_norm, false);
    let pattern: f64 = if p_norm < pval { (1.0 - c_value).signum() } else { 0.0 };

    (pattern, c_value, p_norm)
}


fn build_spatial_weight(neighbors: HashMap<usize, Vec<usize>>) -> SpatialWeight {
    let mut neighbors_data: Vec<Vec<usize>> = vec![];
    let mut labels: Vec<usize> = vec![];

    for (k, v) in neighbors {
        labels.push(k);
        neighbors_data.push(v);
    }

    SpatialWeight::from_neighbors(neighbors_data, labels)
}

pub fn moran_i(neighbors: HashMap<usize, Vec<usize>>, x: Vec<f64>, pval: f64) -> (f64, f64, f64) {
    let w = build_spatial_weight(neighbors);
    moran_i_index(Array::from_vec(x).view(), w, true, pval)
}

pub fn geary_c(neighbors: HashMap<usize, Vec<usize>>, x: Vec<f64>, pval: f64) -> (f64, f64, f64) {
    let w = build_spatial_weight(neighbors);
    geary_c_index(Array::from_vec(x).view(), w, pval)
}