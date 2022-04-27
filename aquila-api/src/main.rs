extern crate core;

use actix_cors::Cors;
use actix_files as fs;
use actix_web::{App, get, HttpResponse, HttpServer, Responder, web};
use actix_web::http::{header, StatusCode};
use actix_web::middleware::Logger;
use actix_web::web::Data;
use anyhow::Result;
use dotenv::dotenv;
use env_logger::Env;
use log::info;
use sqlx::postgres::PgPoolOptions;
use config::{Config, Environment};
use serde::{Serialize, Deserialize};

mod db;
mod utils;
mod routes;
mod analysis;

#[derive(Deserialize, Serialize)]
pub struct AquilaConfig {
    pub host: String,
    pub port: String,
    pub database_url: String,
    pub max_connections: u32,
    pub static_dir: String,
}

#[get("/")]
async fn index() -> impl Responder {
    HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("index.html"))
}


#[actix_web::main]
async fn main() -> Result<()> {
    env_logger::Builder::from_env(
        Env::default().default_filter_or("info")
    ).init();

    dotenv().ok();

    let builder = Config::builder()
        .add_source(Environment::default()).build().unwrap();
    let config: AquilaConfig = builder.try_deserialize().unwrap();

    let db_pool = PgPoolOptions::new()
        .max_connections(config.max_connections)
        .connect(&config.database_url)
        .await?;

    info!("Using postgresql db at: {}", &config.database_url);

    let static_dir = config.static_dir.clone();

    let server = HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            // .wrap(DefaultHeaders::new()
            //     .header("Access-Control-Allow-Origin", "*")
            //     .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            //     .header("Access-Control-Allow-Credentials", "true")
            //     .header("Access-Control-Max-Age", 1728000)
            //     .header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"))
            .wrap(Cors::default()
                .allowed_origin("http://127.0.0.1:3000")
                .allowed_origin("http://localhost:3000") // allow next.js server
                .allowed_origin("https://aquila.cheunglab.org")
                // allow any port on localhost
                // .allowed_origin_fn(|origin, _req_head| {
                //     origin.as_bytes().starts_with(b"http://localhost")

                // manual alternative:
                // unwrapping is acceptable on the origin header since this function is
                // only called when it exists
                // req_head
                //     .headers()
                //     .get(header::ORIGIN)
                //     .unwrap()
                //     .as_bytes()
                //     .starts_with(b"http://localhost")
                // })
                // set allowed methods list
                .allowed_methods(vec!["GET", "POST"])
                // set allowed request header list
                .allowed_headers(&[header::AUTHORIZATION, header::ACCEPT, header::ACCESS_CONTROL_ALLOW_ORIGIN])
                // add header to allowed list
                .allowed_header(header::CONTENT_TYPE)
                // set list of headers that are safe to expose
                .expose_headers(&[header::CONTENT_DISPOSITION])
                // set preflight cache TTL
                .max_age(36000)
            )
            .app_data(Data::new(db_pool.clone()))
            // Change the payload size limit to 50MiB, default is only 2MiB
            .app_data(web::JsonConfig::default().limit(2503422))
            .service(fs::Files::new("/static", &static_dir).show_files_listing())
            .service(fs::Files::new("/img", "./image"))
            .service(index)
            .configure(routes::init)
    })
        .bind(format!("{}:{}", config.host, config.port))?;

    server.run().await?;

    Ok(())
}
