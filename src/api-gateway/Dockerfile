FROM node:18-alpine

WORKDIR /app

COPY src/api-gateway/package.json .

RUN yarn install

COPY src/api-gateway/app ./src/app

COPY src/utils ./src/utils

COPY .env tsconfig.json src/api-gateway/nest-cli.json ./

RUN yarn run build
