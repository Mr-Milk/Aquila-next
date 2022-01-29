use anyhow::Result;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool, Row};

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct CellInfo {
    roi_id: String,
    data_uuid: String,
    cell_x: Vec<f64>,
    cell_y: Vec<f64>,
    cell_type: Vec<String>,
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct CellExp {
    roi_id: String,
    data_uuid: String,
    marker: String,
    expression: Vec<f64>,
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct CellExpAll {
    pub(crate) markers: Vec<String>,
    pub(crate) exp_matrix: Vec<Vec<f64>>,
}

impl CellInfo {
    pub async fn get_cell_info(roi_id: String, pool: &PgPool) -> Result<CellInfo> {

        let info: CellInfo = sqlx::query_as(
            r#"
            SELECT * FROM cell_info WHERE roi_id = $1;
            "#,
        )
            .bind(roi_id.clone())
            .fetch_one(pool)
            .await?;

        Ok(info)
    }

}

impl CellExp {
    pub async fn get_roi_exp(roi_id: String, marker: String, pool: &PgPool) -> Result<CellExp> {

        let exp: CellExp = sqlx::query_as(
            r#"
            SELECT * FROM cell_exp WHERE
            roi_id = $1 AND marker = $2;
            "#
        )
            .bind(roi_id)
            .bind(marker)
            .fetch_one(pool)
            .await?;

        Ok(exp)
    }
}

impl CellExpAll {
    pub async fn get_roi_exp_all(roi_id: String, pool: &PgPool) -> Result<CellExpAll> {
        let recs = sqlx::query(
            r#"
            SELECT * FROM cell_exp WHERE roi_id = $1;
            "#
        )
            .bind(roi_id)
            .fetch_all(pool)
            .await?;

        let mut markers = vec![];
        let mut exp_matrix = vec![];

        for rec in recs {
            markers.push(rec.try_get("marker")?);
            exp_matrix.push(rec.try_get("expression")?);
        }

        Ok(CellExpAll{
            markers,
            exp_matrix,
        })
    }
}