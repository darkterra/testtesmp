FROM node:9-alpine
LABEL Jeremy Young


ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /api
WORKDIR /api
#ADD package.json package-lock.json /api/
#RUN npm --pure-lockfile
ADD . /api

EXPOSE 3000
CMD ["npm", "run", "docker:start"]
