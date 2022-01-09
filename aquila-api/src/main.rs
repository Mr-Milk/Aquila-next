mod config;
mod db;
mod utils;
mod routes;
mod analysis;

use actix_cors::Cors;
use actix_files as fs;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use anyhow::Result;
use actix_web::http::{header, StatusCode};
use actix_web::middleware::{Logger};
use env_logger::Env;
use dotenv::dotenv;
use log::info;
use sqlx::postgres::PgPoolOptions;


#[get("/")]
async fn index() -> impl Responder {
    HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("index.html"))
}


#[actix_web::main]
async fn main() -> Result<()>{
    env_logger::Builder::from_env(
        Env::default().default_filter_or("info")
    ).init();

    dotenv().ok();

    let config = crate::config::Config::from_env().unwrap();
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
                      // .allowed_origin("http://project.local:8080")
                      // allow any port on localhost
                      .allowed_origin_fn(|origin, _req_head| {
                          origin.as_bytes().starts_with(b"http://localhost")

                          // manual alternative:
                          // unwrapping is acceptable on the origin header since this function is
                          // only called when it exists
                          // req_head
                          //     .headers()
                          //     .get(header::ORIGIN)
                          //     .unwrap()
                          //     .as_bytes()
                          //     .starts_with(b"http://localhost")
                      })
                      // set allowed methods list
                      .allowed_methods(vec!["GET", "POST"])
                      // set allowed request header list
                      .allowed_headers(&[header::AUTHORIZATION, header::ACCEPT])
                      // add header to allowed list
                      .allowed_header(header::CONTENT_TYPE)
                      // set list of headers that are safe to expose
                      .expose_headers(&[header::CONTENT_DISPOSITION])
                      // set preflight cache TTL
                      .max_age(3600)
            )
            .data(db_pool.clone())
            .service(fs::Files::new("/static", &static_dir).show_files_listing())
            .service(fs::Files::new("/img", "../image"))
            .service(index)
            .configure(routes::init)
    })
        .bind(format!("{}:{}", config.host, config.port))?;

    server.run().await?;

    Ok(())

}
