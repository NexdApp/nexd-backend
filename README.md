# Nexd project

![Push Container to Heroku](https://github.com/NexdApp/nexd-backend/workflows/Push%20Container%20to%20Heroku/badge.svg)

## Introduction

The backend for nexd is build using [nest.js](https://nestjs.com/).

## Getting started

Please install the node modules:

`npm install`

You can use a postgres (postgis extension) installation on your local machine using docker:

`npm run docker:postgis`

The important environment files for local development are `.env.development.local` and `.env.postgis.local`.

To start the development:

`npm start`

With an automatic reload:

`npm run start:dev`

## Environments

### Local development

## CI/CD

For the sake of simplicity, a single docker container is build using the github actions.

Currently, this container is pushed directly to heroku. Later on, it is supposed to be pushed to the github container registry as well.

## Database

Postgres is used.

## TODO

- [ ] Token content
- [ ] use class-validator
- [x] Pipes (validation...)
- [ ] Same user or admin guard
- [ ] permission role model
- [ ] permission role decorators
- [ ] logger middleware
- [ ] check migrations
- [ ] ssl database
- [ ] exclude for password
- [ ] pgadmin docker command
- [ ] env config validation
- [ ] HMR
- [ ] exception handling
- [ ] configuration module in database -> use isDev
- [ ] use query builder for upsert of help list request ids
- [ ] query arrays through comma separation parsing pipe?
