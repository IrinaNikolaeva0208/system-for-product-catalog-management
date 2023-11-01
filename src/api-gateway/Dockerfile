FROM node:18-alpine

WORKDIR /app

COPY src/api-gateway/package.json .

RUN yarn install

COPY src/api-gateway ./src

COPY src/utils ./utils

COPY .env tsconfig.json ./

RUN yarn run build

CMD [ "node",  "dist/main" ]