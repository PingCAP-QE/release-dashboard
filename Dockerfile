# pull the base image
FROM node:14.15-alpine

# set the working direction
WORKDIR /app

# copy config
COPY package.json yarn.lock ./

# install dependencies
RUN yarn install

# copy all file
COPY . ./

# start app
CMD ["yarn", "start"]
