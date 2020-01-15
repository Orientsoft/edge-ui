FROM node:10-alpine

ADD public /edge-ui/public
ADD src /edge-ui/src
ADD ice.config.js /edge-ui/ice.config.js
ADD jsconfig.json /edge-ui/jsconfig.json
ADD package.json /edge-ui/package.json

WORKDIR /edge-ui

RUN npm install -g cnpm
RUN cnpm install

CMD ["npm","start"]




