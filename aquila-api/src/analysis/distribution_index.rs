use std::collections::HashMap;
use itertools::Itertools;
use kiddo::distance::squared_euclidean;
use ndarray::Array1;
use rand::{Rng, thread_rng};
use rayon::prelude::*;
use crate::analysis::geo_ops::points2bbox;
use crate::analysis::neighbors_search::kdtree_builder;
use crate::analysis::stats::{chisquare2pvalue, zscore2pvalue};

const EMPTY_RETURN: (f64, f64, usize) = (0.0, 0.0, 0);

pub struct QuadStats {
    pub(crate) nx: usize,
    pub(crate) ny: usize,
    pub(crate) cells_grid_id: Vec<usize>,
}

impl QuadStats {
    pub fn new() -> QuadStats {
        QuadStats {
            nx: 10,
            ny: 10,
            cells_grid_id: vec![],
        }
    }

    pub fn grid_counts(&mut self,
                       points: Vec<(f64, f64)>,
                       bbox: Option<(f64, f64, f64, f64)>,
                       quad: Option<(usize, usize)>,
                       rect_side: Option<(f64, f64)>,
    ) -> HashMap<usize, usize>
    {
        let points_bbox = points2bbox(points.to_owned());
        let bbox = match bbox {
            Some(data) => {
                if (data.0 <= points_bbox.0) &
                    (data.1 <= points_bbox.1) &
                    (data.2 >= points_bbox.2) &
                    (data.3 >= points_bbox.3) {
                    data
                } else {
                    println!("Provided bbox failed to cover all the points! Use the minimum bounding box");
                    points_bbox
                }
            }
            _ => points_bbox
        }; // if bbox is not provide, calculate it for user

        let width = bbox.2 - bbox.0;
        let height = bbox.3 - bbox.1;

        match quad { // match to quad first
            Some(data) => {
                self.nx = data.0;
                self.ny = data.1;
            }
            _ => { // if quad is None, match rect_side
                match rect_side {
                    Some(rect) => {
                        let nx = (width / rect.0).floor() as usize;
                        let ny = (height / rect.1).floor() as usize;
                        if (nx == 0) | (ny == 0) {
                            panic!("The side of the rect is bigger than the bbox")
                        } else {
                            self.nx = nx;
                            self.ny = ny;
                        }
                    }
                    _ => { // if both quad and rect_side is failed, set quad to (10, 10)
                        self.nx = 10;
                        self.ny = 10;
                    }
                }
            }
        }

        if (self.nx == 0) | (self.ny == 0) { panic!("quadratic cannot perform with 0 rectangles") }

        let nx_f: f64 = self.nx as f64;
        let ny_f: f64 = self.ny as f64;
        let width = bbox.2 - bbox.0;
        let height = bbox.3 - bbox.1;

        let wx = width / nx_f;
        let hy = height / ny_f;

        let mut dict_id: Vec<usize> = vec![];
        for i in 0..self.ny {
            for j in 0..self.nx {
                dict_id.push(j + i * self.nx)
            }
        }
        let mut dict_id_count: HashMap<usize, usize> = dict_id.iter().map(|i| (*i, 0)).collect();

        for point in points {
            let mut index_x = ((point.0 - bbox.0) / wx).floor() as usize;
            let mut index_y = ((point.1 - bbox.1) / hy).floor() as usize;
            if index_x == self.nx { index_x -= 1 };
            if index_y == self.ny { index_y -= 1 };
            let id_ = index_y * self.nx + index_x;
            let id_count = dict_id_count.get_mut(&id_).unwrap();
            *id_count += 1;
            self.cells_grid_id.push(id_);
        }

        dict_id_count
    }
}

fn get_pattern(v: f64, p_value: f64, pval: f64) -> usize {
    let reject_null = p_value < pval;

    let pattern: usize = if reject_null {
        if v > 1.0 { 3 } else if v == 1.0 { 2 } else { 1 }
    } else { 1 };

    pattern
}

pub fn ix_dispersion(points: Vec<(f64, f64)>,
                     bbox: (f64, f64, f64, f64),
                     r: f64,
                     resample: usize,
                     pval: f64,
                     min_cells: usize,
) -> (f64, f64, usize) // return (index_value, p_value, pattern)
{
    let n = points.len();
    return if n < min_cells {
        EMPTY_RETURN
    } else {
        let tree = kdtree_builder(&points);
        let mut counts = vec![0.0; resample];
        let mut rng = thread_rng();
        for i in 0..resample {
            let x: f64 = rng.gen_range(bbox.0..bbox.2);
            let y: f64 = rng.gen_range(bbox.1..bbox.3);
            let within = tree.within_unsorted(&[x, y], r, &squared_euclidean).unwrap();
            counts[i] = within.len() as f64;
        };

        let counts = Array1::from_vec(counts);
        let counts_mean = counts.mean().unwrap();
        if counts_mean != 0.0 {
            let id = counts.var(0.0) / counts_mean;
            let ddof = (n - 1) as f64;
            let chi2_v = ddof * id;
            let p_value = chisquare2pvalue(chi2_v, ddof);
            let pattern = get_pattern(id, p_value, pval);
            (id, p_value, pattern)
        } else { EMPTY_RETURN } // if sample nothing, return 0
    };
}

pub fn morisita_ix(points: Vec<(f64, f64)>,
                   bbox: (f64, f64, f64, f64),
                   quad: Option<(usize, usize)>,
                   rect_side: Option<(f64, f64)>,
                   pval: f64,
                   min_cells: usize, )
                   -> (f64, f64, usize) {
    let n = points.len();
    return if n < min_cells {
        EMPTY_RETURN
    } else {
        let counts = QuadStats::new().grid_counts(points, Option::from(bbox), quad, rect_side);
        let quad_count = Array1::from_vec(counts.values()
            .into_iter().map(|x| *x as f64).collect_vec());
        let sum_x = quad_count.sum();
        let sum_x_sqr = quad_count.mapv(|i| i.powi(2)).sum();
        if sum_x > 1.0 {
            let id = n as f64 * (sum_x_sqr - sum_x) / (sum_x.powi(2) - sum_x);
            let chi2_v = id * (sum_x - 1.0) + n as f64 - sum_x;
            let p_value = chisquare2pvalue(chi2_v, (n - 1) as f64);
            let pattern = get_pattern(id, p_value, pval);
            (id, p_value, pattern)
        } else { EMPTY_RETURN }
    };
}


pub fn clark_evans_ix(points: Vec<(f64, f64)>,
                      bbox: (f64, f64, f64, f64),
                      pval: f64,
                      min_cells: usize, )
                      -> (f64, f64, usize) {
    let n = points.len();
    return if n < min_cells {
        EMPTY_RETURN
    } else {
        let tree = kdtree_builder(&points);

        let area = (bbox.2 - bbox.0) * (bbox.3 - bbox.1);
        let r: Array1<f64> = points.iter().map(|p| {
            let nearest = tree.nearest(&[p.0, p.1], 2, &squared_euclidean).unwrap();
            let np = points[*nearest[1].1];
            squared_euclidean(&[np.0, np.1], &[p.0, p.1])
        }).collect();
        let intensity = n as f64 / area;
        let nnd_mean = r.mean().unwrap();
        let nnd_expected_mean = 1.0 / (2.0 * intensity.sqrt());
        let big_r = nnd_mean / nnd_expected_mean;
        let pi = std::f64::consts::PI;
        let se: f64 = (((4.0 - pi) * area) / (4.0 * pi)).sqrt() / n as f64;
        let z = (nnd_mean - nnd_expected_mean) / se;
        let p_value = zscore2pvalue(z, true);
        let reject_null = p_value < pval;
        let pattern: usize = if reject_null {
            if big_r < 1.0 { 3 } else if big_r == 1.0 { 2 } else { 1 }
        } else { 1 };
        (big_r, p_value, pattern)
    };
}

pub fn ix_dispersion_parallel(points_collections: Vec<Vec<(f64, f64)>>,
                              bbox: (f64, f64, f64, f64),
                              r: f64,
                              resample: usize,
                              pval: f64,
                              min_cells: usize, ) -> Vec<(f64, f64, usize)>
{
    points_collections.into_par_iter().map(|p| ix_dispersion(p, bbox, r, resample, pval, min_cells)).collect()
}

pub fn morisita_parallel(points_collections: Vec<Vec<(f64, f64)>>,
                         bbox: (f64, f64, f64, f64),
                         quad: Option<(usize, usize)>,
                         rect_side: Option<(f64, f64)>,
                         pval: f64,
                         min_cells: usize, ) -> Vec<(f64, f64, usize)>
{
    points_collections.into_par_iter().map(|p| morisita_ix(p, bbox, quad, rect_side, pval, min_cells)).collect()
}

pub fn clark_evans_parallel(points_collections: Vec<Vec<(f64, f64)>>,
                            bbox: (f64, f64, f64, f64),
                            pval: f64,
                            min_cells: usize, ) -> Vec<(f64, f64, usize)>
{
    points_collections.into_par_iter().map(|p| clark_evans_ix(p, bbox, pval, min_cells)).collect()
}



