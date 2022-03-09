# Aquila: Spatial single-cell database and analysis platform

### Data preproces `/aquila-preprocess`

The scripts are written in Python, the database use PostgreSQL.

### API Server `aquila-api` and `aquila-sv`

The API Server is written in Rust, including the analysis code. The spatial variable gene is called from python, so a specific python env must be satified.

To run a dev build with HMR
```shell
cd aquila-api
cargo watch -x 'run --bin aquila-api' --workdir .
```

To run a production build
```shell
cargo build --release && ./target/release/aquila-api
```

The computed server for spatial variable gene is in FastAPI and run as docker image.


### UI `aquila-ui`

The UI part is implemented using Next.js, the analysis part is powered by indexedDB.

We also use WebWorker to run tasks parallel on the web.

To run a dev build with HMR
```shell
cd aquila-ui
yarn dev
```