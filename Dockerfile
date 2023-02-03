# official: https://codefresh.io/docs/docs/learn-by-example/nodejs/react/
FROM node:14.15-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

FROM nginx:1.23-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
