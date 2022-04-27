use counter::Counter;
use itertools::Itertools;
use ndarray::parallel::prelude::*;
use ndarray::prelude::*;
use ordered_float::OrderedFloat;
use std::collections::HashMap;

fn arr_mean_stack(arr: ArrayView2<f64>) -> (Array2<f64>, Array1<f64>) {
    let arr_mean: Array1<f64> = arr.mean_axis(Axis(1)).unwrap();
    let arr_means: Array2<f64> = (arr.t().to_owned() - arr_mean).t().to_owned();
    let arr_meanss: Array1<f64> = arr_means
        .mapv(|a: f64| a.powi(2))
        .sum_axis(Axis(1))
        .mapv(|a: f64| a.sqrt());
    return (arr_means, arr_meanss);
}


pub fn pair2_pearson(arr1: ArrayView2<f64>, arr2: ArrayView2<f64>) -> Array1<f64>
{
    if arr1.shape() != arr2.shape() {
        panic!("The shape of two input array does not match")
    }
    let s = arr1.shape()[0];
    let (arr1_means, arr1_meanss) = arr_mean_stack(arr1);
    let (arr2_means, arr2_meanss) = arr_mean_stack(arr2);

    let combs: Vec<(usize, usize)> = (0..s).combinations_with_replacement(2)
        .into_iter()
        .map(|i| (i[0], i[1]))
        .collect();
    let r: Vec<f64> = combs.into_par_iter().map(|(s1, s2)| {
        let c1 = arr1_means.slice(s![s1, ..]);
        let c2 = arr2_means.slice(s![s2, ..]);
        let ss_c1 = arr1_meanss[s1];
        let ss_c2 = arr2_meanss[s2];
        (&c1 * &c2).sum() / (ss_c1 * ss_c2)
    }).collect();
    Array::from_vec(r)
}


fn spearman_rank(arr: ArrayView1<f64>) -> Array1<f64> {
    let mut sorted_arr = arr.iter().map(|a: &f64| OrderedFloat(*a)).collect_vec();
    sorted_arr.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let mut mapper = HashMap::<OrderedFloat<f64>, usize>::new();
    for (ix, n) in sorted_arr.iter().enumerate() {
        match mapper.get(n) {
            None => { mapper.insert(*n, ix + 1); }
            _ => {}
        };
    };
    let count = sorted_arr.into_iter().collect::<Counter<_>>();
    let mut rank = HashMap::<OrderedFloat<f64>, f64>::new();
    for (k, c) in count.iter() {
        let vf = *mapper.get(&k).unwrap() as f64;
        let cf = c.clone() as f64;
        if *c > 1 {
            let r = (vf * cf + ((cf - 1.0) * cf / 2.0)) / cf;
            rank.insert(*k, r);
        } else { rank.insert(*k, vf); }
    }
    arr.iter().map(|a| *rank.get(&OrderedFloat(*a)).unwrap()).collect()
}


pub fn pair2_spearman(arr1: ArrayView2<f64>, arr2: ArrayView2<f64>) -> Array1<f64> {
    let arr1_c = arr1.to_owned();
    let arr2_c = arr2.to_owned();
    let s = arr1.shape()[1];
    let mut m1: Array2<f64> = Array::zeros((0, s));
    let mut m2: Array2<f64> = Array::zeros((0, s));
    arr1_c.axis_iter(Axis(0))
        .for_each(|a| {
            m1.push_row(spearman_rank(a).view()).unwrap();
        });
    arr2_c.axis_iter(Axis(0))
        .for_each(|a| {
            m2.push_row(spearman_rank(a).view()).unwrap();
        });
    pair2_pearson(m1.view(), m2.view())
}
