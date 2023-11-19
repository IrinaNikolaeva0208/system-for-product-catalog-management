FROM node:18-alpine

WORKDIR /app

COPY src/auth/package.json .

RUN yarn install --network-timeout 100000

COPY src/auth/app ./src/app

COPY src/utils ./src/utils

COPY .env tsconfig.json src/auth/nest-cli.json ./

RUN yarn run build
