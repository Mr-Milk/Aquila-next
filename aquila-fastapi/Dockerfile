#
FROM tensorflow/tensorflow:latest-gpu

#
WORKDIR /code

#
COPY ./requirements.txt /code/requirements.txt

#
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

#
COPY aquila_spatial /code/aquila_spatial
COPY main.py /code/main.py

#
CMD ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]
