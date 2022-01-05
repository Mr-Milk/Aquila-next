use std::collections::HashMap;
use counter::Counter;
use geo::LineString;
use geo::algorithm::area::Area;
use geo::bounding_rect::BoundingRect;
use ndarray::Array;
use ndarray_stats::QuantileExt;


pub fn create_points(x: &Vec<f64>, y: &Vec<f64>) -> Vec<(f64, f64)> {
    x.into_iter().zip(y).map(|(p1, p2)| (*p1, *p2)).collect()
}


/// Get bbox of a series of points
///
/// # Arguments
///
/// * `p`: A vector of points
///
/// returns: (f64, f64, f64, f64)
///
/// # Examples
///
/// ```
///
/// ```
pub fn points2bbox(p: Vec<(f64, f64)>) -> (f64, f64, f64, f64) { // minx, miny, maxx, maxy
    let line_string: LineString<f64> = p.into();
    let bounding_rect = line_string.bounding_rect().unwrap();
    (bounding_rect.min().x, bounding_rect.min().y, bounding_rect.max().x, bounding_rect.max().y)
}

pub fn bbox_area(p: Vec<(f64, f64)>) -> f64 {
    let line_string: LineString<f64> = p.into();
    line_string.bounding_rect().unwrap().unsigned_area()
}

pub fn cell_density(p: Vec<(f64, f64)>, types: Vec<String>) -> HashMap<String, f64> {
    let area = bbox_area(p);
    println!("The calculated area is {}", area);
    let mut values = vec![];
    let mut uni_types = vec![];
    let type_counter = types.into_iter()
        .collect::<Counter<_>>();

    type_counter.into_iter()
        .for_each(|(k, v)| {
            values.push((*v as f64) / area);
            uni_types.push(k);
    });
    let values = Array::from_vec(values);
    let min = values.min().unwrap().clone();
    let max = values.max().unwrap().clone();
    let interval = max - min;
    uni_types
        .into_iter()
        .zip(values.into_iter())
        .map(|(t, v)| {
        (String::from(t), ((v - min) / interval) * 9.0 + 1.0)
    }).collect()
}