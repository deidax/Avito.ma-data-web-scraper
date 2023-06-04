FROM python:3.10
ENV PYTHONUNBUFFERED=1

WORKDIR /pfe/backend

ADD . .

# Install build dependencies for lxml
RUN apt-get update && apt-get install -y \
    python3-dev \
    libc-dev \
    libxml2-dev \
    libxslt-dev \
    lib32z1-dev 

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY ./requirements.txt ./

RUN $VIRTUAL_ENV/bin/pip install --upgrade pip
RUN $VIRTUAL_ENV/bin/pip install --default-timeout=100 future
# # Download lxml wheel file
# RUN pip download --no-deps lxml==4.6.3
RUN $VIRTUAL_ENV/bin/pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

COPY ./entrypoint.sh /

ENTRYPOINT ["bash", "/entrypoint.sh"]
