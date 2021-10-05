FROM node:lts-alpine as build-stage
WORKDIR /usr/src/app/vuejs_frontend

ADD . .

COPY package*.json ./
RUN npm install --verbose

EXPOSE 8080

CMD ["npm", "run", "serve"]