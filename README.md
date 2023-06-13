
# Avito Scraper, Elasticsearch and Kibana

Make sure to have docker and docker compose installed


## Installation

Clone project

```bash
  git clone https://github.com/deidax/pfe.git
```
Build project with docker compose

```bash
  docker-compose build --no-cach
```
Run project

```bash
  docker-compose up
```

Create user to login

```bash
  curl -X POST http://127.0.0.1:8000/auth/users/ --data 'username=admin&password=pfe123456'
```
Open in browser

```bash
  http://localhost:8080/
```

## Login

```bash
  Username: admin
  password: pfe123456
```

