## Dependencies

- NodeJS
- Docker
- PostgreSQL Client
  - `sudo apt install postgresql postgresql-contrib`
- Yarn

## Installation

Install dependencies

```bash
yarn
```

### Environment Configuration

Create a `.env` file in the root folder

Configure PostgreSQL:

```sh
sudo -i -u postgres # Switch over to the postgres account on your server by typing:
psql -U postgres # type the default password, usually 'postgres'
create user username with encrypted password 'secretpassword';
create database dbname with owner username;
\l # dbname should appear with username as owner
```

then `ctrl + c` to exit the shell, then try to connect with  
`psql -U username dbname` (it will ask for your password)

Next, in `.env.development` and `.env`, set these vars :

> DATABASE_TYPE=postgres  
> DATABASE_HOST=localhost  
> DATABASE_PORT=5432  
> DATABASE_USERNAME=username  
> DATABASE_PASSWORD=secretpassword  
> DATABASE_NAME=dbname
> JWT_SECRET=jwt_awesome_key

### Docker

To spin up a docker container for local API development, following commands can be used.

Create the postgres docker volume:

`docker volume create --name=pgdata`

Run the postgis image:

`docker run -d --name postgres-nearbuy -p 5432:5432 -e POSTGRES_PASSWORD=secretpassword -e POSTGRES_DB=dbname -e POSTGRES_USER=username -v pgdata:/var/lib/postgresql/data postgis/postgis:12-2.5`

---

To mount the project with Docker, you can use `yarn deploy:local` (which executes `docker-compose up`)

## Usage

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## Swagger

RESTful APIs you can describe with already integrated Swagger.
To see all available endpoints visit `~~http://localhost:3000/api/docs~~`

## TypeORM

[TypeORM](http://typeorm.io/) gives you possibility to use next db types:
`mysql`, `postgres`, `mariadb`, `sqlite`, etc. Please look at docs for more details.
We have provided working example with `sqlite`, but you have possibility to change
this through `ormconfig.json`. By default you will get `sqlite-example.sql` file
created in the root directory, but it's ignored by git.

### Seeding

See [TypeORM-Fixtures](https://robinck.github.io/typeorm-fixtures/)

## Authentication - JWT

Already preconfigured JWT authentication.
It's suggested to change current password hashing to something more secure.
You can start use already working implementation of `Login` and `Registration`
endpoints, just take a look at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

## Sources

- [TypeORM MongoDB Documentation](https://github.com/typeorm/typeorm/blob/master/docs/mongodb.md)

- [Great MongoDB tutorial](https://www.tutorialspoint.com/mongodb/mongodb_quick_guide.htm)

- [Another NestJS boilerplate](https://github.com/unlight/nest-typescript-starter/tree/ad59f3443f347e668f1d6f6c22f78f01bddcfb89)

- [Tutorial to build NestJS API + MongoDB with Mongoose instead of TypeORM](https://scotch.io/tutorials/building-a-modern-app-using-nestjs-mongodb-and-vuejs?utm_source=spotim&utm_medium=spotim_recirculation&spotim_referrer=recirculation&spot_im_comment_id=sp_D7GE1sbz_46694_c_Ta07US)

- [Basic Authentication with JSON Web Tokens and Passport](https://scotch.io/@devGson/api-authentication-with-json-web-tokensjwt-and-passport)
- [... or this one better integrated with NestJS](https://codebrains.io/jwt-auth-with-nestjs-passport-and-express/)

- [Boilerplate with expiration-based JWT tokens](https://github.com/abouroubi/nestjs-auth-jwt)

- [Variant using Basic auth with cookie in session](http://blog.exceptionfound.com/index.php/2018/06/07/nestjs-basic-auth-and-sessions/#Get_Projects_for_Authenticated_User)
