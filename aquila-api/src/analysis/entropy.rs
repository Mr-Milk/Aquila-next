use counter::Counter;
use kiddo::distance::squared_euclidean;
use kiddo::KdTree;
use ndarray::prelude::*;
use ndarray::Array;


fn pairs_counter(pairs: Vec<usize>, n: usize) -> Vec<f64> {
    let mut arr = vec![0.0; n + 1];
    for e in pairs {
        arr[e] += 1.0;
    }
    arr
}

pub fn leibovici_entropy(points: Vec<(f64, f64)>, types: Vec<usize>, d: f64, order: bool) -> f64 {
    let n = points.len();
    let tn = types.len();
    if n != tn { panic!("The length of points must be the same as types") }


    let mut tree: KdTree<f64, usize, 2> = KdTree::new();
    for (p, label) in (&points).iter().zip(&types) {
        tree.add(&[p.0, p.1], *label).unwrap();
    }
    let neighbors: Vec<Vec<usize>> = points.iter().map(|p| {
        let within = tree.within_unsorted(&[p.0, p.1], d*d, &squared_euclidean).unwrap();
        within.iter().map(|(_, i)| { **i }).collect()
    }).collect();

    let mut pairs: Vec<usize> = Vec::new();
    let mut pmax = 0;
    for (i, neighs) in neighbors.into_iter().enumerate() {
        for cell in neighs {
            if cell > i {
                let p = if order { types[cell] + 2 * types[i] } else { types[cell] + types[i] };
                pairs.push(p);
                if p > pmax { pmax = p };
            }
        }
    }
    let mut v = vec![];
    for i in pairs_counter(pairs, pmax) { // the result is a sparse array, remove zeros to speed up
        if i != 0.0 { v.push(i) }
    }
    let mut v: Array1<f64> = Array::from_vec(v);
    // println!("{:?}", v.clone());
    v = &v / v.sum();
    v.mapv(|i| i * (1.0 / i).log2()).sum()
}


pub fn shannon_entropy(types: Vec<usize>) -> f64 {
    let count = types.into_iter().collect::<Counter<_>>();
    let v = count.values();
    let mut data = Array::from_iter(v.into_iter().map(|i| *i as f64));
    data = &data / data.sum();
    -data.mapv(|x| if x == 0.0 {0.0} else {x*x.ln()}).sum()
}