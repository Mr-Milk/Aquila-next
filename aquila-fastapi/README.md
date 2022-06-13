# Development

```shell
uvicorn main:app --reload
```

# Build Instruction

First enter the directory
```shell
cd aquila-fastapi
```

This will build an image called `aquila-fastapi`

```shell
docker build -t aquila-fastapi .
```

Shutdown the previous running containers

```shell
docker stop aquila-fastapi-server
```

Remove the previous containers or there will be name conflicts

```shell
docker stop aquila-fastapi-server
```

This will run a container `aquila-fastapi-server` based on
own image in delete mode `-d`
```shell
docker run -d \
  --name aquila-fastapi-server \
  --mount type=bind,source=$HOME/projects/aquila-static,target=/code/static \
  -p 8000:8000 aquila-fastapi
```

Once built, start the stopped container
```shell
docker start aquila-fastapi-server
```