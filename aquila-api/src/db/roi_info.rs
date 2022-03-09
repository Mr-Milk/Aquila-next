use anyhow::Result;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct ROIInfo {
    roi_id: String,
    data_uuid: String,
    meta: String,
}

impl ROIInfo {
    pub async fn data_roi_info(data_id: String, pool: &PgPool) -> Result<Vec<ROIInfo>> {
        let rois: Vec<ROIInfo> = sqlx::query_as(
            r#"
            SELECT * FROM roi_info WHERE data_uuid = $1;
            "#,
        )
            .bind(data_id)
            .fetch_all(pool)
            .await?;

        Ok(rois)
    }

    pub async fn data_roi_info_one(data_id: String, pool: &PgPool) -> Result<ROIInfo> {
        let roi: ROIInfo = sqlx::query_as(
            r#"
            SELECT * FROM roi_info WHERE data_uuid = $1;
            "#,
        )
            .bind(data_id)
            .fetch_one(pool)
            .await?;

        Ok(roi)
    }

    pub async fn one_roi_info(roi_id: String, pool: &PgPool) -> Result<ROIInfo> {
        let roi: ROIInfo = sqlx::query_as(
            r#"
            SELECT * FROM roi_info WHERE roi_id = $1;
            "#,
        )
            .bind(roi_id)
            .fetch_one(pool)
            .await?;

        Ok(roi)
    }
}