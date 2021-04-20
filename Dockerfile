FROM node:12.14.0-alpine3.11

RUN apk add --no-cache bash

RUN yarn global add @nestjs/cli

USER node

WORKDIR /home/node/app