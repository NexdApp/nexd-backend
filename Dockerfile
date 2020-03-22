FROM node:alpine

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm clean-install

COPY .env ./.env.development
# Bundle app source
COPY . .

# Expose port and start application
EXPOSE 8080

CMD [ "npm", "start" ]
