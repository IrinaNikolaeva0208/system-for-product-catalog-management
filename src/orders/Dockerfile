FROM node:18-alpine

WORKDIR /app

COPY src/orders/package.json .

RUN yarn install

COPY src/orders/app ./src/app

COPY src/utils ./src/utils

COPY .env tsconfig.json src/orders/nest-cli.json ./

RUN yarn run build
