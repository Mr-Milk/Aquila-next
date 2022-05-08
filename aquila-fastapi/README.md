# Development

```shell
uvicorn main:app --reload
```

# Build Instruction

This will build an image called `aquila-fastapi`

```shell
docker build -t aquila-fastapi .
```

This will run a container `aquila-fastapi-server` based on
own image in delete mode `-d`
```shell
docker run -d \
  --name aquila-fastapi-server \
  -p 80:80 aquila-fastapi
```