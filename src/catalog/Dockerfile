FROM node:18-alpine

WORKDIR /app

COPY src/catalog/package.json .

RUN yarn install

COPY src/catalog ./src

COPY src/utils ./utils

COPY .env tsconfig.json ./

RUN yarn run build

CMD [ "node",  "dist/catalog/main" ]