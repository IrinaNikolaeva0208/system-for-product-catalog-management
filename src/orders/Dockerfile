FROM node:18-alpine

WORKDIR /app

COPY src/orders/package.json .

RUN yarn install --network-timeout 100000

COPY src/orders/app ./src/app

COPY src/utils ./src/utils

COPY migrations/ ./src/migrations/

COPY .env tsconfig.json src/orders/nest-cli.json ./

RUN yarn run build
