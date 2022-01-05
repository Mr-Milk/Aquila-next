use std::collections::HashMap;
use counter::Counter;
use itertools::{min, Itertools};
use rand::prelude::SliceRandom;
use rand::thread_rng;
use rayon::prelude::*;

use crate::analysis::stats::{mean_u, mean_f, std_f};
use crate::analysis::zscore2pvalue;

fn remove_rep_neighbors(rep_neighbors: Vec<Vec<usize>>, labels: Vec<usize>, ignore_self: bool)
                            -> Vec<Vec<usize>> {
    let min_offset = min(labels.iter()).unwrap();
    let mut neighbors = vec![];
    for (i, neighs) in rep_neighbors.iter().enumerate() {
        let mut new_neighs = vec![];
        let l = labels[i];
        if ignore_self {
            for cell in neighs {
                if *cell > l {
                    new_neighs.push(*cell - *min_offset)
                }
            }
        } else {
            for cell in neighs {
                if *cell >= l {
                    new_neighs.push(*cell - *min_offset)
                }
            }
        }

        neighbors.push(new_neighs)
    }

    neighbors
}

fn count_neighbors<'a>(
    types: &Vec<&'a str>,
    neighbors: &Vec<Vec<usize>>,
    cell_combs: &Vec<(&'a str, &'a str)>,
    order: bool,
)
    -> HashMap<(&'a str, &'a str), f64> {
    let mut storage = cell_combs
        .iter()
        .map(|comb| (comb.to_owned(), vec![]))
        .collect::<HashMap<(&str, &str), Vec<usize>>>();
    for (k, v) in neighbors.iter().enumerate() {
        let cent_type = types[k];
        let neigh_type: Counter<_> = { v.iter().map(|i| types[*i]).collect::<Counter<_>>() };
        for (nt, c) in neigh_type.iter() {
            let comb = (cent_type, *nt);
            let reverse_comb = (*nt, cent_type);
            let count = *c;
            if order {
                storage.get_mut(&comb).unwrap().push(count);
                storage.get_mut(&reverse_comb).unwrap().push(count);
            } else {
                match storage.get_mut(&comb) {
                    None => storage.get_mut(&reverse_comb).unwrap().push(count * 2),
                    Some(s) => s.push(count * 2),
                };
            }
        }
    }

    let mut results: HashMap<(&'a str, &'a str), f64> = HashMap::new();
    for (k, v) in storage.iter() {
        results.insert(k.to_owned(), mean_u(&v));
    }
    results
}

pub fn cell2cell_interaction(
    types: Vec<&str>,
    neighbors: Vec<Vec<usize>>,
    labels: Vec<usize>,
    times: usize,
    pval: f64,
    method: String,
    ignore_self: bool,
) -> Vec<(&str, &str, f64, f64)> {
    let order = false;
    let uni: Vec<&str> = types.clone().into_iter().unique().collect();
    let mut cellcombs: Vec<(&str, &str)> = uni.to_owned().into_iter().combinations(2).map(|i| (i[0], i[1])).collect();
    for i in &uni {
        cellcombs.push((*i, *i))
    };
    let neighbors = remove_rep_neighbors(neighbors, labels, ignore_self);
    let real_data = count_neighbors(&types, &neighbors, &cellcombs, order);

    let mut simulate_data = cellcombs
        .iter()
        .map(|comb| (comb.to_owned(), vec![]))
        .collect::<HashMap<(&str, &str), Vec<f64>>>();

    let all_data: Vec<HashMap<(&str, &str), f64>> = (0..times)
        .into_par_iter()
        .map(|_| {
            let mut rng = thread_rng();
            let mut shuffle_types = types.to_owned();
            shuffle_types.shuffle(&mut rng);
            let perm_result =
                count_neighbors(&shuffle_types, &neighbors, &cellcombs, order);
            perm_result
        })
        .collect();

    for perm_result in all_data {
        for (k, v) in perm_result.iter() {
            simulate_data.get_mut(k).unwrap().push(*v);
        }
    }

    let mut results: Vec<(&str, &str, f64, f64)> = Vec::with_capacity(simulate_data.len());

    for (k, v) in simulate_data.into_iter() {
        let real = real_data[&k];

        if method == "pval" {
            let mut gt: f64 = 0.0;
            let mut lt: f64 = 0.0;
            for i in v.iter() {
                if i >= &real {
                    gt += 1.0
                }
                if i <= &real {
                    lt += 1.0
                }
            }
            let gt: f64 = gt / (times.to_owned() as f64 + 1.0);
            let lt: f64 = lt / (times.to_owned() as f64 + 1.0);
            let dir: f64 = (gt < lt) as i32 as f64;
            let udir: f64 = !(gt < lt) as i32 as f64;
            let p: f64 = gt * dir + lt * udir;
            let sig: f64 = (p < pval) as i32 as f64;
            let sigv: f64 = sig * (dir - 0.5).signum();
            results.push((k.0, k.1, sigv, p));
        } else {
            let m = mean_f(&v);
            let sd = std_f(&v);
            let mut sigv = 0.0;
            let mut z = 0.0;

            if sd != 0.0 {
                z = (real - m) / sd;
                let p = zscore2pvalue(z, false);
                let dir: f64 = (z > 0.0) as i32 as f64;
                let sig: f64 = (p < pval) as i32 as f64;
                sigv = sig * (dir - 0.5).signum();
            };
            results.push((k.0, k.1, sigv, z));
        }
    }

    results
}