FROM node:18-alpine

WORKDIR /app

COPY src/basket/package.json .

RUN yarn install

COPY src/basket/app ./src/app

COPY src/utils ./src/utils

COPY .env tsconfig.json src/basket/nest-cli.json ./

RUN yarn run build
