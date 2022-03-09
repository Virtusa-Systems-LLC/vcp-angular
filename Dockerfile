FROM node:12-alpine
ENV NODE_ENV=production

MAINTAINER ypoint

# Create app directory
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . ./

RUN npm install
RUN npm run build

RUN npm i --only=production

CMD [ "node", "server.js" ]
