FROM node:18-alpine

WORKDIR /app

COPY src/basket/package.json .

RUN yarn install --network-timeout 100000

COPY src/basket/app ./src/app

COPY src/utils ./src/utils

COPY migrations/ ./src/migrations/

COPY .env tsconfig.json src/basket/nest-cli.json ./

RUN yarn run build
