FROM node:18-alpine

WORKDIR /app

COPY src/catalog/package.json .

RUN yarn install

COPY src/catalog/app ./src/app

COPY src/utils ./src/utils

COPY .env tsconfig.json src/catalog/nest-cli.json ./

RUN yarn run build
