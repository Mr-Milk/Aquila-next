# Aquila: Spatial single-cell database and analysis platform

### Data preproces `/aquila-preprocess`

The scripts are written in Python, the database use PostgreSQL.

### API Server `aquila-api` and `aquila-fastapi`

The main API Server is written in Rust using Actix. 

The side API Server is written in Python using FastAPI to run following analysis:
- Spatial variable gene: SpatialDE
- Ripley's Function K, F, G, L
- Spatial community detection
- Cell centrality

Two server is registered under the same domain: `https://api.cheunglab.org` through
reverse proxy provided by Nginx.

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

8G RAM is needed to run a dev build,
```shell
$Env:NODE_OPTIONS="--max-old-space-size=8192" # powershell
export NODE_OPTIONS="--max-old-space-size=8192" # linux
```
```shell
cd aquila-ui
yarn dev
```



## Deployment

The UI part will be deployed automatically by Vercel.

To deploy actix server
```shell
cd aquila-api

SERVER_PID="$(pidof aquila-api)"

echo "Terminate current running process at $SERVER_PID"

kill $SERVER_PID

cargo build --release

nohup ./target/release/aquila-api > log.out 2>&1 &
```