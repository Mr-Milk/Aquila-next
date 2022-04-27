use std::collections::HashSet;

use delaunator::{Point, triangulate};
use kiddo::distance::squared_euclidean;
use kiddo::KdTree;
use crate::analysis::custom_type::Point2D;

pub fn points_neighbors_triangulation(points: Vec<Point2D>) -> Vec<Vec<usize>>
{
    let points: Vec<Point> = points.into_iter().map(|p| Point { x: p[0], y: p[1] }).collect();
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

    neighbors.into_iter().map(|i| i.into_iter().collect()).collect()
}


// Build a kdtree using kiddo with labels
pub fn kdtree_builder<const K: usize>(
    points: &Vec<[f64; K]>,
) -> KdTree<f64, usize, K> {
    let mut tree: KdTree<f64, usize, K> = KdTree::new();
    for (p, label) in points.iter().zip(0..points.len()) {
        tree.add(p, label).unwrap();
    }
    tree
}

pub fn get_neighbors<const K: usize>(
    tree: KdTree<f64, usize, K>,
    points: Vec<[f64; K]>,
    r: f64,
    k: usize,
) -> Vec<Vec<usize>> {
    let neighbors = points
        .iter()
        .map(|p| {
            if r > 0.0 {
                if k > 0 {
                    tree.best_n_within(p, r * r, k, &squared_euclidean).unwrap()
                } else {
                    let within = tree.within_unsorted(p, r * r, &squared_euclidean).unwrap();
                    within.iter().map(|(_, i)| **i).collect()
                }
            } else {
                let within = tree.nearest(p, k, &squared_euclidean).unwrap();
                within.iter().map(|(_, i)| **i).collect()
            }
        })
        .collect();
    neighbors
}
