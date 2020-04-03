# Nexd project

## Introduction

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

## CI/CD

## Database

## TODO

- [ ] Token content
- [ ] use class-validator
- [ ] Pipes (validation...)
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
