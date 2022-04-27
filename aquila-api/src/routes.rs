use std::collections::HashMap;
use std::detect::__is_feature_detected::sha;
use std::sync::Arc;

use actix_web::{get, HttpResponse, post, Responder, web};
use actix_web::web::Json;
use itertools::{Itertools, izip};
use kiddo::distance::squared_euclidean;
use ndarray::{Array, Array2, ArrayView2};
use serde::{Deserialize, Serialize};
use rayon::prelude::*;
use sqlx::PgPool;

use crate::analysis::{cell_interaction, clark_evans_parallel, kdtree_builder, get_neighbors, build_spatial_weight, ix_dispersion_parallel, leibovici_entropy, morisita_parallel, points2bbox, points_neighbors_triangulation, shannon_entropy, Point2D, pair2_spearman, pair2_pearson, moran_i_index, geary_c_index};
use crate::db::{CellExp, CellInfo, CellInfo3D, DataRecords, ROIInfo};
use crate::utils::{error_response, json_response};

#[get("/dbstats")]
async fn dbstats(db_pool: web::Data<PgPool>) -> impl Responder {
    let result = DataRecords::dbstats(db_pool.get_ref()).await;
    match result {
        Ok(stats) => json_response(stats),
        Err(e) => error_response(e),
    }
}

#[get("/data_ids")]
async fn data_ids(db_pool: web::Data<PgPool>) -> impl Responder {
    let result = DataRecords::all_data_ids(db_pool.get_ref()).await;
    match result {
        Ok(data_ids) => json_response(data_ids),
        Err(e) => error_response(e),
    }
}

#[get("/data_ids_2d")]
async fn data_ids_2d(db_pool: web::Data<PgPool>) -> impl Responder {
    let result = DataRecords::data_ids_2d(db_pool.get_ref()).await;
    match result {
        Ok(data_ids_2d) => json_response(data_ids_2d),
        Err(e) => error_response(e),
    }
}

#[get("/data_ids_3d")]
async fn data_ids_3d(db_pool: web::Data<PgPool>) -> impl Responder {
    let result = DataRecords::data_ids_3d(db_pool.get_ref()).await;
    match result {
        Ok(data_ids_3d) => json_response(data_ids_3d),
        Err(e) => error_response(e),
    }
}

#[get("/records")]
async fn records(db_pool: web::Data<PgPool>) -> impl Responder {
    let result = DataRecords::all_records(db_pool.get_ref()).await;
    match result {
        Ok(records) => HttpResponse::Ok().json(records),
        Err(e) => error_response(e),
    }
}

#[get("/record/{data_id}")]
async fn one_record(data_id: web::Path<String>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = DataRecords::one_record(data_id.into_inner(), db_pool.get_ref()).await;
    match result {
        Ok(record) => json_response(record),
        Err(e) => error_response(e),
    }
}

#[get("/rois/{data_id}")]
async fn rois_info(data_id: web::Path<String>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = ROIInfo::data_roi_info(data_id.into_inner(), db_pool.get_ref()).await;
    match result {
        Ok(info) => json_response(info),
        Err(e) => error_response(e),
    }
}

#[get("/rois_one/{data_id}")]
async fn rois_info_one(data_id: web::Path<String>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = ROIInfo::data_roi_info_one(data_id.into_inner(), db_pool.get_ref()).await;
    match result {
        Ok(info) => json_response(info),
        Err(e) => error_response(e),
    }
}

#[get("/roi/{roi_id}")]
async fn one_roi_info(roi_id: web::Path<String>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = ROIInfo::one_roi_info(roi_id.into_inner(), db_pool.get_ref()).await;
    match result {
        Ok(info) => json_response(info),
        Err(e) => error_response(e),
    }
}

#[get("/cell_info/{roi_id}")]
async fn cell_info(roi_id: web::Path<String>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = CellInfo::get_cell_info(roi_id.into_inner(), db_pool.get_ref()).await;
    match result {
        Ok(info) => json_response(info),
        Err(e) => error_response(e),
    }
}

#[get("/cell_info_3d/{roi_id}")]
async fn cell_info_3d(roi_id: web::Path<String>, db_pool: web::Data<PgPool>) -> impl Responder {
    let result = CellInfo3D::get_cell_info(roi_id.into_inner(), db_pool.get_ref()).await;
    match result {
        Ok(info) => json_response(info),
        Err(e) => error_response(e),
    }
}

#[get("/cell_exp/{roi_id}/{marker}")]
async fn cell_exp(query: web::Path<(String, String)>, db_pool: web::Data<PgPool>) -> impl Responder {
    let query = query.into_inner();
    let result = CellExp::get_roi_exp(query.0, query.1, db_pool.get_ref()).await;
    match result {
        Ok(info) => json_response(info),
        Err(e) => error_response(e),
    }
}

#[derive(Serialize, Deserialize)]
pub struct QueryExp {
    roi_id: String,
    markers: Vec<String>,
}

#[post("/cell_exp")]
async fn cell_exp_batch(params: Json<QueryExp>, db_pool: web::Data<PgPool>) -> impl Responder {
    let params = params.into_inner();
    let result = CellExp::get_roi_exp_batch(params.roi_id, params.markers, db_pool.get_ref()).await;
    match result {
        Ok(info) => json_response(info),
        Err(e) => error_response(e),
    }
}

#[derive(Serialize, Deserialize)]
pub struct RequestROINeighbors {
    x: Vec<f64>,
    y: Vec<f64>,
    z: Option<Vec<f64>>,
    method: String,
    r: f64,
    k: usize,
}

#[derive(Serialize, Deserialize)]
pub struct Neighbors {
    p1: Vec<usize>,
    p2: Vec<usize>,
    weights: Vec<f64>,
    map: HashMap<usize, Vec<usize>>,
}


fn create_neighbors_response<const K: usize>(neighbors: Vec<Vec<usize>>, pts: Vec<[f64; K]>) -> Neighbors
{
    let mut p1: Vec<usize> = vec![];
    let mut p2: Vec<usize> = vec![];
    let mut weights: Vec<f64> = vec![];
    let mut neighbors_map: HashMap<usize, Vec<usize>> = HashMap::new();

    for (i1, data) in neighbors.into_iter().enumerate() {
        for i2 in data.iter() {
            if i1 < *i2 {
                p1.push(i1);
                p2.push(*i2);
                weights.push(
                    squared_euclidean(&pts[i1], &pts[*i2]).sqrt()
                )
            }
        }

        neighbors_map.insert(i1, data);
    }

    Neighbors {
        p1,
        p2,
        weights,
        map: neighbors_map,
    }
}

#[post("/cell_neighbors")]
async fn run_neighbors_search(params: web::Json<RequestROINeighbors>) -> impl Responder {
    let data = params.into_inner();
    let response = match data.method.as_str() {
        "kd-tree" => {
            match data.z {
                Some(z) => {
                    let points = data.x.iter()
                        .zip(data.y.iter())
                        .zip(z.iter())
                        .map(|((x, y), z)| [*x, *y, *z])
                        .collect();
                    let tree = kdtree_builder(&points);
                    let neighbors = get_neighbors(tree, points.clone(), data.r, data.k);
                    create_neighbors_response(neighbors, points)
                }
                None => {
                    let points = data.x.iter()
                        .zip(data.y.iter())
                        .map(|(x, y)| [*x, *y])
                        .collect();
                    let tree = kdtree_builder(&points);
                    let neighbors = get_neighbors(tree, points.clone(), data.r, data.k);
                    create_neighbors_response(neighbors, points)
                }
            }
        }
        _ => {
            let points: Vec<[f64; 2]> = data.x.iter()
                .zip(data.y.iter())
                .map(|(x, y)| [*x, *y])
                .collect();
            let neighbors = points_neighbors_triangulation(points.clone());
            create_neighbors_response(neighbors, points)
        }
    };

    json_response(response)
}

#[derive(Serialize, Deserialize)]
pub struct RequestCellDistribution {
    x: Vec<f64>,
    y: Vec<f64>,
    cell_type: Vec<String>,
    method: String,
    pvalue: f64,
    r: f64,
    resample: usize,
    quad: (usize, usize),
}

#[derive(Serialize, Deserialize)]
pub struct CellDistributionResult {
    ix_value: Vec<f64>,
    pvalue: Vec<f64>,
    pattern: Vec<usize>,
    cell_type: Vec<String>,
}

#[post("/cell_distribution")]
async fn run_cell_distribution(params: web::Json<RequestCellDistribution>) -> impl Responder {
    const MIN_CELLS: usize = 10;
    let data = params.into_inner();
    let points = data.x.iter()
        .zip(data.y.iter())
        .map(|(x, y)| [*x, *y])
        .collect();
    let bbox = points2bbox(points);

    let mut types_groups: HashMap<String, Vec<Point2D>> = HashMap::new();
    for (p1, p2, t) in izip!(data.x, data.y, data.cell_type) {
        let ps = types_groups.entry(t).or_insert(vec![]);
        (*ps).push([p1, p2]);
    }
    let mut points_collections: Vec<Vec<Point2D>> = vec![];
    let mut cell_type: Vec<String> = vec![];
    for (k, v) in types_groups {
        cell_type.push(k);
        points_collections.push(v);
    }
    let result = match data.method.as_str() {
        "id" => { ix_dispersion_parallel(points_collections, bbox, data.r, data.resample, data.pvalue, MIN_CELLS) }
        "morisita" => { morisita_parallel(points_collections, bbox, Some(data.quad), None, data.pvalue, MIN_CELLS) }
        _ => { clark_evans_parallel(points_collections, bbox, data.pvalue, MIN_CELLS) }
    };
    let mut ix_value = vec![];
    let mut pvalue = vec![];
    let mut pattern = vec![];
    for (a, b, c) in result {
        ix_value.push(a);
        pvalue.push(b);
        pattern.push(c);
    }
    json_response(CellDistributionResult {
        ix_value,
        pvalue,
        pattern,
        cell_type,
    })
}

#[derive(Serialize, Deserialize)]
pub struct ExpVector {
    marker: String,
    exp: Vec<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct RequestSpatialCorr {
    p1: Vec<usize>,
    p2: Vec<usize>,
    exp_matrix: Vec<ExpVector>,
    method: String,
}

#[derive(Serialize, Deserialize)]
pub struct RequestCorr {
    exp_matrix: Vec<ExpVector>,
    method: String,
}

#[derive(Serialize, Deserialize)]
pub struct CorrResult {
    marker1: String,
    marker2: String,
    value: f64,
}

fn build_array(exp: &Vec<ExpVector>, indices: &Vec<usize>) -> (Array2<f64>, Vec<String>)
{
    let mut arr: Vec<f64> = vec![];
    let mut markers: Vec<String> = vec![];

    for v in exp.iter() {
        markers.push(v.marker.clone());
        for i in indices {
            arr.push(*(v.exp).get(*i).unwrap())
        }
    }

    (Array2::from_shape_vec((exp.len(), indices.len()), arr).unwrap(), markers)
}


fn coexp(arr1: ArrayView2<f64>, arr2: ArrayView2<f64>, method: &str, markers: Vec<String>) -> Vec<CorrResult> {
    let result = match method {
        "spearman" => { pair2_spearman(arr1, arr2) }
        _ => { pair2_pearson(arr1, arr2) }
    };

    (0..markers.len()).combinations_with_replacement(2)
        .into_iter().zip(
        result.iter()
    )
        .map(|(combs, v)| CorrResult {
            marker1: markers[combs[0]].clone(),
            marker2: markers[combs[1]].clone(),
            value: *v,
        }).collect()
}

fn spatial_coexp(data: RequestSpatialCorr) -> Vec<CorrResult> {
    let (arr1, markers1) = build_array(&data.exp_matrix, &data.p1);
    let (arr2, _) = build_array(&data.exp_matrix, &data.p2);

    coexp(arr1.view(), arr2.view(), data.method.as_str(), markers1)
}


fn build_exp_array(exp: &Vec<ExpVector>) -> (Array2<f64>, Vec<String>)
{
    let mut arr = vec![];
    let mut markers: Vec<String> = vec![];
    for v in exp {
        arr.extend_from_slice(&v.exp[..]);
        markers.push(v.marker.clone());
    }

    (Array2::from_shape_vec((exp.len(), exp[0].exp.len()), arr).unwrap(),
        markers)
}

fn regular_coexp(data: RequestCorr) -> Vec<CorrResult> {
    let (arr, markers) = build_exp_array(&data.exp_matrix);
    coexp(arr.view(), arr.view(), data.method.as_str(), markers)
}

#[post("/spatial_coexp")]
async fn run_spatial_coexp(params: web::Json<RequestSpatialCorr>) -> impl Responder {
    let data = params.into_inner();
    let result = spatial_coexp(data);
    json_response(result)
}

#[post("/coexp")]
async fn run_coexp(params: web::Json<RequestCorr>) -> impl Responder {
    let data = params.into_inner();
    let result = regular_coexp(data);
    json_response(result)
}

#[derive(Serialize, Deserialize)]
pub struct RequestSpatialAutoCorr {
    neighbors_map: HashMap<usize, Vec<usize>>,
    exp_matrix: Vec<ExpVector>,
    pvalue: f64,
    method: String,
}

#[derive(Serialize, Deserialize)]
pub struct SpatialAutoCorrResult {
    marker: String,
    pattern: f64,
    value: f64,
    pvalue: f64,
}

#[post("/spatial_autocorr")]
async fn run_spatial_autocorr(params: web::Json<RequestSpatialAutoCorr>) -> impl Responder {
    let data = params.into_inner();
    let pval = data.pvalue;
    let w = build_spatial_weight(data.neighbors_map);
    let response: Vec<SpatialAutoCorrResult> = match data.method.as_str() {
        "moran_i" => {
            data.exp_matrix.into_par_iter().map(|e| {
                let acorr = moran_i_index(Array::from_vec(e.exp).view(), &w, true, pval);
                SpatialAutoCorrResult {
                    marker: e.marker,
                    pattern: acorr.0,
                    value: acorr.1,
                    pvalue: acorr.2
                }
            }).collect()
        }
        _ => {
            data.exp_matrix.into_par_iter().map(|e| {
                let acorr = geary_c_index(Array::from_vec(e.exp).view(), &w, pval);
                SpatialAutoCorrResult {
                    marker: e.marker,
                    pattern: acorr.0,
                    value: acorr.1,
                    pvalue: acorr.2
                }
            }).collect()
        }
    };
    json_response(response)
}


#[derive(Serialize, Deserialize)]
pub struct RequestSpatialEntropy {
    x: Vec<f64>,
    y: Vec<f64>,
    types: Vec<String>,
    d: f64,
}

#[derive(Serialize, Deserialize)]
pub struct RequestEntropy {
    types: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct EntropyResult {
    entropy: f64,
}


fn create_num_types(types: Vec<String>) -> Vec<usize> {
    let mut types_mapper: HashMap<String, usize> = HashMap::new();
    let mut entry: usize = 1;
    for t in types.clone() {
        match types_mapper.get(&t) {
            Some(_) => {}
            None => {
                types_mapper.insert(t, entry);
                entry += 1;
            }
        }
    }
    types.iter().map(|t| {
        *types_mapper.get(t).unwrap()
    }).collect()
}

#[post("/spatial_entropy")]
async fn run_spatial_entropy(params: web::Json<RequestSpatialEntropy>) -> impl Responder {
    let data = params.into_inner();
    let points = data.x.iter()
        .zip(data.y.iter())
        .map(|(x, y)| [*x, *y])
        .collect();
    let types = data.types.iter().map(|t| t.as_str()).collect();
    let entropy = leibovici_entropy(points, types, data.d);
    json_response(EntropyResult { entropy })
}

#[post("/entropy")]
async fn run_entropy(params: web::Json<RequestEntropy>) -> impl Responder {
    let data = params.into_inner();
    let types = create_num_types(data.types);
    let entropy = shannon_entropy(types);
    json_response(EntropyResult { entropy })
}


#[derive(Serialize, Deserialize)]
pub struct RequestCCI {
    neighbors_map: HashMap<usize, Vec<usize>>,
    cell_type: Vec<String>,
    times: usize,
    pvalue: f64,
    method: String,
}

#[derive(Serialize, Deserialize)]
pub struct CCIResult {
    type1: Vec<String>,
    type2: Vec<String>,
    score: Vec<f64>,
    pattern: Vec<f64>,
}

#[post("/cell_interactions")]
async fn run_cell_interactions(params: web::Json<RequestCCI>) -> impl Responder {
    let data = params.into_inner();
    let types = data.cell_type.iter().map(|t| t.as_str()).collect();
    let mut neighbors_data: Vec<Vec<usize>> = vec![];
    let mut labels: Vec<usize> = vec![];

    for (k, v) in data.neighbors_map {
        labels.push(k);
        neighbors_data.push(v);
    }
    let results = cell_interaction(types,
                                   neighbors_data,
                                   labels,
                                   data.times,
                                   data.pvalue,
                                   data.method, );
    let mut type1 = vec![];
    let mut type2 = vec![];
    let mut score = vec![];
    let mut pattern = vec![];
    for r in results {
        type1.push(String::from(r.0));
        type2.push(String::from(r.1));
        score.push(r.3);
        pattern.push(r.2)
    }

    json_response(CCIResult {
        type1,
        type2,
        score,
        pattern,
    })
}


pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(dbstats);
    cfg.service(data_ids);
    cfg.service(data_ids_2d);
    cfg.service(data_ids_3d);
    cfg.service(records);
    cfg.service(one_record);
    cfg.service(rois_info);
    cfg.service(rois_info_one);
    cfg.service(one_roi_info);
    cfg.service(cell_info);
    cfg.service(cell_info_3d);
    cfg.service(cell_exp);
    cfg.service(cell_exp_batch);
    // cfg.service(cell_exp_all);
    // cfg.service(get_roi_coexp);
    cfg.service(run_neighbors_search);
    cfg.service(run_cell_distribution);
    cfg.service(run_spatial_coexp);
    cfg.service(run_coexp);
    cfg.service(run_spatial_autocorr);
    cfg.service(run_spatial_entropy);
    cfg.service(run_entropy);
    cfg.service(run_cell_interactions);
}