use actix_web::HttpResponse;
use serde::{Deserialize, Serialize};
use anyhow::Error;
use log::error;

pub fn json_response<'a, T: Deserialize<'a> + Serialize>(content: T) -> HttpResponse {
    HttpResponse::Ok().json(content)
}

pub fn error_response(e: Error) -> HttpResponse {
    error!("{}", e);
    HttpResponse::BadRequest().body("Error")
}