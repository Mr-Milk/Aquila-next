use std::collections::{HashMap, HashSet};
use delaunator::{Point, triangulate};
use kiddo::distance::squared_euclidean;
use kiddo::KdTree;


pub fn points_neighbors_kdtree(points: Vec<(f64, f64)>,
                               r: f64,
                               k: usize,
) -> HashMap<usize, Vec<usize>>
{
    let tree = kdtree_builder(&points);
    let neighbors: HashMap<usize, Vec<usize>> = points.into_iter()
        .enumerate()
        .map(|(i, (p1, p2))| {
            let p = &[p1, p2];
            let result = if r > 0.0 {
                if k > 0 {
                    points_neighbors_knn_within(&tree, p, r, k)
                } else {
                    points_neighbors_within(&tree, p, r)
                }
            } else {
                points_neighbors_knn(&tree, p, k)
            };
            (i, result)
        }).collect();
    neighbors
}

pub fn points_neighbors_triangulation(points: Vec<(f64, f64)>) -> HashMap<usize, Vec<usize>>
{
    let points: Vec<Point> = points.into_iter().map(|p| Point { x: p.0, y: p.1 }).collect();
    let result = triangulate(&points).triangles;
    let mut neighbors: Vec<HashSet<usize>> = (0..points.len()).into_iter().map(|_| HashSet::new()).collect();

    (0..result.len()).into_iter().step_by(3).for_each(|i| {
        let slice = vec![result[i], result[i + 1], result[i + 2]];
        for p1 in &slice {
            for p2 in &slice {
                neighbors[*p1].insert(*p2);
            }
        }
    });

    neighbors
        .into_iter()
        .enumerate()
        .map(|(i, n)|
            (i, n.into_iter().collect()))
        .collect()
}


// Build a kdtree using kiddo with labels
pub fn kdtree_builder(points: &Vec<(f64, f64)>) -> KdTree<f64, usize, 2>
{
    let mut tree: KdTree<f64, usize, 2> = KdTree::new();
    for (label, p) in points.iter().enumerate() {
        tree.add(&[p.0, p.1], label).unwrap();
    }
    tree
}


fn points_neighbors_within(tree: &KdTree<f64, usize, 2>, point: &[f64; 2], r: f64)
                           -> Vec<usize> {
    let within = tree.within_unsorted(point, r * r, &squared_euclidean).unwrap();
    within.iter().map(|(_, i)| { **i }).collect()
}


fn points_neighbors_knn(tree: &KdTree<f64, usize, 2>, point: &[f64; 2], k: usize)
                        -> Vec<usize> {
    let within = tree.nearest(point, k, &squared_euclidean).unwrap();
    within.iter().map(|(_, i)| **i).collect()
}


fn points_neighbors_knn_within(tree: &KdTree<f64, usize, 2>, point: &[f64; 2], r: f64, k: usize)
                               -> Vec<usize> {
    tree.best_n_within(point, r * r, k, &squared_euclidean).unwrap()
}