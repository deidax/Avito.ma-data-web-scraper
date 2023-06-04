FROM python:3.10
ENV PYTHONUNBUFFERED=1

WORKDIR /pfe/avito-scrapy-server

ADD . .



ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY ./scrapyd.conf /etc/scrapyd/


COPY ./requirements.txt ./


RUN $VIRTUAL_ENV/bin/pip install --upgrade pip
RUN $VIRTUAL_ENV/bin/pip install --default-timeout=100 future
RUN $VIRTUAL_ENV/bin/pip install --no-cache-dir --timeout 60 -r requirements.txt

EXPOSE 6800


ENTRYPOINT ["scrapyd"]
