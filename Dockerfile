# syntax=docker/dockerfile:1

FROM node:20.11.0-alpine AS base

WORKDIR /app

COPY ["package.json", "yarn.lock*", "./"]

FROM base as dev
ENV NODE_ENV=development
RUN yarn install --frozen-lockfile
COPY . .
CMD [ "yarn", "start:dev" ]

FROM dev as test
ENV NODE_ENV=test
CMD [ "yarn", "test" ]

FROM test as test-cov
CMD [ "yarn", "test:cov" ]

FROM test as test-watch
ENV GIT_WORK_TREE=/app GIT_DIT=/app/.git
RUN apk add git
CMD [ "yarn", "test:watch" ]

FROM base as prod
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile --production
COPY . .
RUN yarn add global @nestjs/cli
RUN yarn build
CMD [ "yarn", "start:prod" ]