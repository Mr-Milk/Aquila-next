use anyhow::Result;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};


#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct DataRecords {
    data_uuid: String,
    technology: String,
    species: String,
    tissue: String,
    disease: String,
    molecule: String,
    markers: Vec<String>,
    source_name: String,
    source_url: String,
    journal: String,
    year: i32,
    cell_count: i32,
    marker_count: i32,
    roi_count: i32,
    is_single_cell: bool,
    has_cell_type: bool,
    // notice: Option<String>,
}


#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct DataRecord {
    data_uuid: String,
    technology: String,
    species: String,
    tissue: String,
    disease: String,
    molecule: String,
    source_name: String,
    source_url: String,
    journal: String,
    year: i32,
    cell_count: i32,
    marker_count: i32,
    roi_count: i32,
    is_single_cell: bool,
    has_cell_type: bool,
    // notice: Option<String>,
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct DBStats {
    data_count: i64,
    tissue_count: i64,
    disease_count: i64,
}

impl DataRecords {
    pub async fn dbstats(pool: &PgPool) -> Result<DBStats> {
        let data = sqlx::query!(
            r#"
            SELECT COUNT(data_uuid) as "count!" FROM data_records;
            "#
        ).fetch_one(pool).await?;
        let tissue = sqlx::query!(
            r#"
            SELECT COUNT(DISTINCT tissue) as "count!" FROM data_records;
            "#
        ).fetch_one(pool).await?;
        let disease = sqlx::query!(
            r#"
            SELECT COUNT(DISTINCT disease) as "count!" FROM data_records;
            "#
        ).fetch_one(pool).await?;

        let stats = DBStats{
            data_count: data.count,
            tissue_count: tissue.count,
            disease_count: disease.count,
        };

        Ok(stats)
    }

    pub async fn all_data_ids(pool: &PgPool) -> Result<Vec<String>> {
        let mut data_ids: Vec<String> = vec![];
        let recs = sqlx::query!(
            r#"
            SELECT data_uuid FROM data_records;
        "#,
        )
            .fetch_all(pool)
            .await?;

        for rec in recs {
            data_ids.push(rec.data_uuid);
        }

        Ok(data_ids)
    }

    pub async fn all_records(pool: &PgPool) -> Result<Vec<DataRecord>> {
        let records: Vec<DataRecord> = sqlx::query_as(
            r#"
            SELECT * FROM data_records;
        "#,
        )
            .fetch_all(pool)
            .await?;

        Ok(records)
    }

    pub async fn one_record(data_id: String, pool: &PgPool) -> Result<DataRecords> {
        let record: DataRecords = sqlx::query_as(
            r#"
            SELECT * FROM data_records WHERE data_uuid = $1;
            "#,
        )
            .bind(data_id)
            .fetch_one(pool)
            .await?;

        Ok(record)
    }

}
