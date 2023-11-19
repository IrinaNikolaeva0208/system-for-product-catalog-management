FROM node:18-alpine

WORKDIR /app

COPY src/catalog/package.json .

RUN yarn install --network-timeout 100000

COPY src/catalog/app ./src/app

COPY src/utils ./src/utils

COPY .env tsconfig.json src/catalog/nest-cli.json ./

RUN yarn run build
