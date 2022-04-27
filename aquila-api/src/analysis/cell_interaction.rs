use std::collections::HashMap;

use counter::Counter;
use itertools::{Itertools};
use rand::prelude::SliceRandom;
use rand::thread_rng;
use rayon::prelude::*;

use crate::analysis::stats::{mean_f, std_f};
use crate::analysis::zscore2pvalue;


pub fn count_neighbors<'a>(
    types: &Vec<&'a str>,
    labels: &Vec<usize>,
    storage_ptr: &HashMap<(&'a str, &'a str), Vec<usize>>,
    neighbors: &Vec<Vec<usize>>,
    type_counts: &HashMap<&str, usize>,
) -> HashMap<(&'a str, &'a str), f64> {
    let mut storage = storage_ptr.clone();
    let label_type_mapper: HashMap<usize, &str> = labels
        .into_iter()
        .zip(types)
        .into_iter()
        .map(|(label, tpy)| (*label, *tpy))
        .collect();
    for (neigh, l) in neighbors.iter().zip(labels).into_iter() {
        let cent_type = label_type_mapper.get(&l).unwrap();
        let neigh_type: Counter<_> = neigh
            .iter()
            .map(|i| *(label_type_mapper.get(i).unwrap()))
            .collect();
        for (nt, count) in neigh_type.iter() {
            let comb = (*cent_type, *nt);
            storage.get_mut(&comb).unwrap().push(*count)
        }
    }
    let mut result: HashMap<(&str, &str), f64> = HashMap::new();
    for (comb, dist) in storage {
        //get the number of center type
        match type_counts.get(comb.0) {
            Some(v) => {
                let avg = (dist.iter().sum::<usize>() as f64) / (*v as f64);
                result.insert(comb, avg);
            }
            None => {}
        }
        // let avg = (dist.iter().sum::<usize>() as f64) / (dist.len() as f64);
        // result.insert(comb, avg);
    }
    result
}


pub fn cell_interaction(
    types: Vec<&str>,
    neighbors: Vec<Vec<usize>>,
    labels: Vec<usize>,
    times: usize,
    pval: f64,
    method: String,
) -> Vec<(&str, &str, f64, f64)> {
    let uni: Vec<&str> = types.clone().into_iter().unique().collect();
    let mut combs: Vec<(&str, &str)> = uni
        .to_owned()
        .into_iter()
        .permutations(2)
        .map(|i| (i[0], i[1]))
        .collect();

    // Add self-self relationship
    for i in &uni {
        combs.push((*i, *i))
    }

    let real_storage: HashMap<(&str, &str), Vec<usize>> =
        combs.iter().map(|comb| (*comb, vec![])).collect();

    let sim_storage: HashMap<(&str, &str), Vec<f64>> =
        combs.iter().map(|comb| (*comb, vec![])).collect();
    let type_counts: HashMap<&str, usize> = types
        .to_owned()
        .into_iter()
        .collect::<Counter<_>>()
        .into_map();

    let real_data = count_neighbors(
        &types,
        &labels,
        &real_storage,
        &neighbors,
        &type_counts,
    );
    let mut simulate_data = sim_storage.clone();

    let all_data: Vec<HashMap<(&str, &str), f64>> = (0..times)
        .into_par_iter()
        .map(|_| {
            let mut rng = thread_rng();
            let mut shuffle_types = types.to_owned();
            shuffle_types.shuffle(&mut rng);
            let perm_result = count_neighbors(
                &shuffle_types,
                &labels,
                &real_storage,
                &neighbors,
                &type_counts,
            );
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
        match real_data.get(&k) {
            // The relationship exists
            Some(real) => {
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
                    let mut dir: f64 = 0.0;
                    let mut udir: f64 = 0.0;
                    if gt < lt {
                        dir = 1.0;
                    } else {
                        udir = 1.0;
                    }
                    let p: f64 = gt * dir + lt * udir;
                    let sig: f64 = (p < pval) as i32 as f64;
                    let sigv: f64 = sig * (dir - 0.5).signum();
                    results.push((k.0, k.1, p, sigv));
                } else {
                    let m = mean_f(&v);
                    let sd = std_f(&v);
                    // let mut p = 1.0;
                    let mut z = 0.0;
                    let sigv = if sd != 0.0 {
                        z = (real - m) / sd;
                        let p = zscore2pvalue(z, false);
                        let dir: f64 = (z > 0.0) as i32 as f64;
                        let sig: f64 = (p < pval) as i32 as f64;
                        sig * (dir - 0.5).signum()
                    } else {
                        0.0
                    };
                    results.push((k.0, k.1, z, sigv));
                }
            }
            // Does not exist, no such cell type in the ROI
            None => { results.push((k.0, k.1, 1.0, 0.0)); }
        }
    }

    results
}