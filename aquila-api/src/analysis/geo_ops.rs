use geo::bounding_rect::BoundingRect;
use geo::LineString;

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
pub fn points2bbox(p: Vec<[f64; 2]>) -> (f64, f64, f64, f64) { // minx, miny, maxx, maxy
    let line_string: LineString<f64> = p.into();
    let bounding_rect = line_string.bounding_rect().unwrap();
    (bounding_rect.min().x, bounding_rect.min().y, bounding_rect.max().x, bounding_rect.max().y)
}
