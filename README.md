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

### Staging on heroku

The environment variables from the `.env.production` file are being used.
Some secrets of course require to be hidden. These are:

`ADMIN_SECRET` : A secret to be used in the header `x-admin-secret` header to access the `PUT /articles` endpoint. Just a workaround until full user accounts are in place.

`API_ROOT_URL`: URL of the API installation (e.g. https://nexd-backend-staging.herokuapp.com )

`DATABASE_URL`: The database connection string. If this is set, the other settings (username, password,... ) of the database are not used.

`JWT_SECRET`: The jwt secret.

Currently, a staging of the `develop` branch is deployed to AWS and to heroku.

On heroku, the URL is: https://nexd-backend-staging.herokuapp.com/

With the swagger being available at: https://nexd-backend-staging.herokuapp.com/api/v1/docs

## CI/CD

For the sake of simplicity, a single docker container is build using the github actions.

Currently, this container is pushed directly to heroku. Later on, it is supposed to be pushed to the github container registry as well.

## Database

Postgres is used. Locally is already a postgis command available. The postgis extension will be used for geo data.

### Migrations

Create your typeorm cli `ormconfig.json` file:

`npm run typeorm:createconfig`

This is not yet fully checked, so please have a look into the `ormconfig.json`. Relative paths seemed to work more reliable.

To create a migration:

`npm run typeorm migration:generate -- -n "<migration name>"`

## TODO

- [ ] Help lists owner validation DRY
- [ ] Token content
- [x] use class-validator
- [x] Pipes (validation...)
- [ ] Same user or admin guard (`userResourceOrAdminsecret.guard.ts`)
- [ ] permission role model
- [ ] permission role decorators
- [x] logger middleware
- [ ] check migrations
- [x] ssl database
- [x] exclude for password
- [x] pgadmin docker command
- [ ] env config validation
- [ ] HMR
- [x] exception handling
- [x] configuration module in database -> use isDev
- [ ] use query builder for upsert of help list request ids
- [ ] query arrays through comma separation parsing pipe?
- [ ] rate limiting (for later)
- [ ] compression
- [ ] compodoc
- [ ] logging service (e.g. papertrail)
