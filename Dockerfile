# pull official base image
FROM node:16.13.0-alpine3.12

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

COPY build ./build
# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# add app
COPY server ./server
EXPOSE 4000
# start app
CMD ["node", "server/app.js"] 