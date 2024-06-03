# scrapy crawl productspider -a url=https://www.avito.ma/fr/rabat/t%C3%A9l%C3%A9phones-%C3%A0_vendre -a options=['price','seller_name', 'subject','seller_phone','city']
FROM python:3.10
ENV PYTHONUNBUFFERED=1

WORKDIR /pfe/avito-scrapy-server

ADD . .

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY ./scrapyd.conf /etc/scrapyd/

COPY ./requirements.txt ./

RUN pip install --upgrade pip
RUN pip install --default-timeout=100 future
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 6800


ENTRYPOINT ["scrapyd"]
