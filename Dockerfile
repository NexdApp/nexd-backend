FROM node:12.16.1-alpine3.9

RUN apk add g++ make python

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm clean-install

# Bundle app source
COPY . .

RUN npm run build

# Add docs later
#RUN npm run docs

EXPOSE 8080


RUN adduser -D localuser

RUN touch ormconfig.json
RUN chown localuser:localuser ormconfig.json

USER localuser


CMD [ "npm", "run", "start:prod:withmigrations" ]
