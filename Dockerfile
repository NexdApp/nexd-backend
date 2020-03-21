FROM node:alpine

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn && yarn cache clean

COPY .env ./.env.development
# Bundle app source
COPY . .

# Expose port and start application
EXPOSE 8080
CMD ["yarn", "start"]
