FROM node:10-alpine

RUN mkdir /app
WORKDIR /app
COPY [^node_modules]* ./
RUN npm install

CMD ['npm','start']




