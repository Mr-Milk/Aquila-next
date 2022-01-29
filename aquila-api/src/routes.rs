use std::collections::HashMap;
use actix_web::{web, get, post, HttpResponse, Responder};
use itertools::{Itertools, izip};
use log::info;
use sqlx::PgPool;
use serde::{Deserialize, Serialize};
use crate::utils::{json_response, error_response};
use crate::db::{DataRecords, ROIInfo, CellInfo, CellExp, CellExpAll};
use crate::analysis::{create_points, points2bbox, points_neighbors_triangulation, points_neighbors_kdtree, cell_density, ix_dispersion_parallel, morisita_parallel, clark_evans_parallel, build_array2, pair2_spearman, pair2_pearson, moran_i, geary_c, leibovici_entropy, shannon_entropy, cell2cell_interaction};

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

#[get("/cell_exp/{roi_id}")]
async fn cell_exp_all(query: web::Path<String>, db_pool: web::Data<PgPool>) -> impl Responder {
    let query = query.into_inner();
    let result = CellExpAll::get_roi_exp_all(query,db_pool.get_ref()).await;
    match result {
        Ok(info) => json_response(info),
        Err(e) => error_response(e),
    }
}

#[get("/cell_exp/{roi_id}/{marker}")]
async fn cell_exp(query: web::Path<(String, String)>, db_pool: web::Data<PgPool>) -> impl Responder {
    let query = query.into_inner();
    let result = CellExp::get_roi_exp(query.0, query.1,db_pool.get_ref()).await;
    match result {
        Ok(info) => json_response(info),
        Err(e) => error_response(e),
    }
}

#[derive(Serialize, Deserialize)]
pub struct RequestROINeighbors {
    x: Vec<f64>,
    y: Vec<f64>,
    method: String,
    r: f64,
    k: usize,
}

#[derive(Serialize, Deserialize)]
pub struct Neighbors {
    p1: Vec<usize>,
    p2: Vec<usize>,
    // np1: Vec<usize>,
    // np2: Vec<usize>,
    map: HashMap<usize, Vec<usize>>
}

#[post("/cell_neighbors")]
async fn run_neighbors_search(params: web::Json<RequestROINeighbors>) -> impl Responder {
    let data = params.into_inner();
    let points = create_points(&data.x, &data.y);
    let neighbors_data: HashMap<usize, Vec<usize>> = match data.method.as_str() {
        "kd-tree" => {
            points_neighbors_kdtree(points, data.r, data.k)
        }
        _ => {
            points_neighbors_triangulation(points)
        }
    };

    let mut p1: Vec<usize> = vec![];
    let mut p2: Vec<usize> = vec![];
    for (i, data) in neighbors_data.iter() {
        for d in data {
            p1.push(*i);
            p2.push(*d);
        }
    }

    json_response(Neighbors{
        p1,
        p2,
        map: neighbors_data
    })
}

#[derive(Serialize, Deserialize)]
pub struct RequestCellDensity {
    x: Vec<f64>,
    y: Vec<f64>,
    cell_type: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct CellDensityResult {
    data: HashMap<String, f64>,
}

#[post("/cell_density")]
async fn run_cell_density(params: web::Json<RequestCellDensity>) -> impl Responder {
    let data = params.into_inner();
    let points = create_points(&data.x, &data.y);
    let result = cell_density(points, data.cell_type);
    json_response(result)
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
    let points = create_points(&data.x, &data.y);
    let bbox = points2bbox(points);

    let mut types_groups: HashMap<String, Vec<(f64, f64)>> = HashMap::new();
    for (p1, p2, t) in izip!(data.x, data.y, data.cell_type) {
        let ps = types_groups.entry(t).or_insert(vec![]);
        (*ps).push((p1, p2));
    }
    let mut points_collections: Vec<Vec<(f64, f64)>> = vec![];
    let mut cell_type: Vec<String> = vec![];
    for (k, v) in types_groups {
        cell_type.push(k);
        points_collections.push(v);
    }
    let result = match data.method.as_str() {
        "id" => { ix_dispersion_parallel(points_collections, bbox, data.r, data.resample, data.pvalue, MIN_CELLS) }
        "morisita" => { morisita_parallel(points_collections, bbox, Some(data.quad), None, data.pvalue, MIN_CELLS)}
        _ => { clark_evans_parallel(points_collections, bbox, data.pvalue, MIN_CELLS)}
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
        cell_type
    })
}

#[derive(Serialize, Deserialize)]
pub struct RequestSpatialCorr {
    neighbors_pairs1: Vec<usize>,
    neighbors_pairs2: Vec<usize>,
    exp_matrix: Vec<Vec<f64>>,
    markers: Vec<String>,
    threshold: f64,
    method: String,
}

#[derive(Serialize, Deserialize)]
pub struct SpatialCorrResult {
    marker1: Vec<String>,
    marker2: Vec<String>,
    corr_value: Vec<f64>,
}

#[derive(Deserialize)]
struct Info {
    roi_id: String,
    neighbors_pairs1: Vec<usize>,
    neighbors_pairs2: Vec<usize>,
    threshold: f64,
    method: String,
}

fn run_coexp(data: RequestSpatialCorr) -> SpatialCorrResult {
    let arr1 = build_array2(&data.exp_matrix, data.neighbors_pairs1);
    let arr2 = build_array2(&data.exp_matrix, data.neighbors_pairs2);
    info!("Build array correctly");
    let markers_combs: Vec<(usize, usize)> = (0..data.markers.len()).combinations_with_replacement(2)
        .into_iter()
        .map(|i| (i[0], i[1]))
        .collect();
    let result = match data.method.as_str() {
        "spearman" => { pair2_spearman(arr1.view(), arr2.view()) }
        _ => { pair2_pearson(arr1.view(), arr2.view()) }
    };
    info!("Run corr correctly");
    let mut marker1 = vec![];
    let mut marker2 = vec![];
    let mut corr_value = vec![];
    for ((m1, m2), v) in markers_combs.into_iter().zip(result.into_iter()) {
        if v > data.threshold {
            marker1.push(data.markers[m1].clone());
            marker2.push(data.markers[m2].clone());
            corr_value.push(v);
        }
    }
    SpatialCorrResult {
        marker1,
        marker2,
        corr_value,
    }
}

#[post("/db_spatial_coexp")]
async fn get_roi_coexp(query: web::Json<Info>, db_pool: web::Data<PgPool>) -> impl Responder {
    info!("Enter processsing func");
    let query = query.into_inner();
    info!("Before parsing to expall");
    let exp_all = CellExpAll::get_roi_exp_all(query.roi_id,db_pool.get_ref()).await;
    match exp_all {
        Ok(info) => {
            info!("Get CellExpAll correctly");
            let result = run_coexp(RequestSpatialCorr{
                neighbors_pairs1: query.neighbors_pairs1,
                neighbors_pairs2: query.neighbors_pairs2,
                exp_matrix: info.exp_matrix,
                markers: info.markers,
                threshold: query.threshold,
                method: query.method,
            });
            info!("Get Final result correctly");
            json_response(result)
        },
        Err(e) => error_response(e),
    }
}

#[post("/spatial_coexp")]
async fn run_spatial_coexp(params: web::Json<RequestSpatialCorr>) -> impl Responder {
    let data = params.into_inner();
    let result = run_coexp(data);
    json_response(result)
}

#[derive(Serialize, Deserialize)]
pub struct RequestSpatialAutoCorr {
    neighbors_map: HashMap<usize, Vec<usize>>,
    expression: Vec<f64>,
    pvalue: f64,
    method: String,
}

#[derive(Serialize, Deserialize)]
pub struct SpatialAutoCorrResult {
    pattern: f64,
    autocorr_value: f64,
    pvalue: f64,
}

#[post("/spatial_autocorr")]
async fn run_spatial_autocorr(params: web::Json<RequestSpatialAutoCorr>) -> impl Responder {
    let data = params.into_inner();
    let result = match data.method.as_str() {
        "moran_i" => {
            moran_i(data.neighbors_map, data.expression, data.pvalue)
        }
        _ => { geary_c(data.neighbors_map, data.expression, data.pvalue ) }
    };
    json_response( SpatialAutoCorrResult {
        pattern: result.0,
        autocorr_value: result.1,
        pvalue: result.2,
    })
}


#[derive(Serialize, Deserialize)]
pub struct RequestSpatialEntropy {
    cell_x: Vec<f64>,
    cell_y: Vec<f64>,
    cell_type: Vec<String>,
    d: f64
}

#[derive(Serialize, Deserialize)]
pub struct RequestEntropy {
    cell_type: Vec<String>,
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
    let points: Vec<(f64, f64)> = data.cell_x.into_iter()
        .zip(data.cell_y.into_iter())
        .map(|(x,y)| {
            (x , y)
    }).collect();
    let types = create_num_types(data.cell_type);
    let entropy = leibovici_entropy(points, types, data.d, false);
    json_response( EntropyResult{ entropy })
}

#[post("/entropy")]
async fn run_entropy(params: web::Json<RequestEntropy>) -> impl Responder {
    let data = params.into_inner();
    let types = create_num_types(data.cell_type);
    let entropy = shannon_entropy(types);
    json_response( EntropyResult{ entropy })
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
    let results = cell2cell_interaction(types,
                                        neighbors_data,
                                        labels,
                                        data.times,
                                        data.pvalue,
                                        data.method,
                                        true);
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

    json_response(CCIResult{
        type1,
        type2,
        score,
        pattern,
    })

}




pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(dbstats);
    cfg.service(data_ids);
    cfg.service(records);
    cfg.service(one_record);
    cfg.service(rois_info);
    cfg.service(one_roi_info);
    cfg.service(cell_info);
    cfg.service(cell_exp);
    // cfg.service(cell_exp_all);
    cfg.service(get_roi_coexp);
    cfg.service(run_neighbors_search);
    cfg.service(run_cell_density);
    cfg.service(run_cell_distribution);
    cfg.service(run_spatial_coexp);
    cfg.service(run_spatial_autocorr);
    cfg.service(run_spatial_entropy);
    cfg.service(run_entropy);
    cfg.service(run_cell_interactions);
}