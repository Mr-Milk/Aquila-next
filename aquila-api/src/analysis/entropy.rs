use std::hash::Hash;
use counter::Counter;
use ndarray::Array;
use ndarray::prelude::*;
use crate::analysis::custom_type::{Point2D, Point3D};
use crate::analysis::{get_neighbors, kdtree_builder};

fn pairs_counter(pairs: Vec<usize>, n: usize) -> Vec<f64> {
    let mut arr = vec![0.0; n + 1];
    for e in pairs {
        arr[e] += 1.0;
    }
    arr
}

pub fn leibovici_entropy(points: Vec<Point2D>, types: Vec<&str>, d: f64) -> f64 {
    let tree = kdtree_builder(&points);
    let neighbors = get_neighbors(tree, points, d, 0);
    leibovici_base(neighbors, types)
}

pub fn leibovici_entropy_3d(points: Vec<Point3D>, types: Vec<&str>, d: f64) -> f64 {
    let tree = kdtree_builder(&points);
    let neighbors = get_neighbors(tree, points, d, 0);
    leibovici_base(neighbors, types)
}

fn leibovici_base(neighbors: Vec<Vec<usize>>, types: Vec<&str>) -> f64 {
    let mut pairs = vec![];
    for (i, neighs) in neighbors.into_iter().enumerate() {
        for cell in neighs {
            if cell > i {
                let p = (types[cell], types[i]);
                pairs.push(p);
            }
        }
    }
    let v = norm_counter_values(pairs);
    v.mapv(|i| i * (1.0 / i).log2()).sum()
}


pub fn shannon_entropy(types: Vec<usize>) -> f64 {
    let count = types.into_iter().collect::<Counter<_>>();
    let v = count.values();
    let mut data = Array::from_iter(v.into_iter().map(|i| *i as f64));
    data = &data / data.sum();
    -data.mapv(|x| if x == 0.0 { 0.0 } else { x * x.ln() }).sum()
}

fn norm_counter_values<T: Hash + Eq>(pairs: Vec<T>) -> Array1<f64> {
    let v = pairs
        .into_iter()
        .collect::<Counter<T>>()
        .values()
        .map(|v| *v as f64)
        .collect();
    let mut v: Array1<f64> = Array::from_vec(v);
    v = &v / v.sum();
    return v;
}