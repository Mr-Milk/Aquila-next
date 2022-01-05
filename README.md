# Aquila: Spatial single-cell database and analysis platform

### Data preproces `/aquila-preprocess`

The scripts are written in Python, the database use PostgreSQL.

### API Server `aquila-api`

The API Server is written in Rust, including the analysis code. The spatial variable gene is called from python, so a specific python env must be satified.

### UI `aquila-ui`

The UI part is implemented using Next.js, the analysis part is powered by indexedDB.

We also use WebWorker to run tasks parallel on the web.

