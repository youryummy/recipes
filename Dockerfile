FROM node:16.13.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

WORKDIR /app
COPY bin/ ./bin
COPY source source
COPY views views
COPY public public
COPY app.js .
COPY circuitBreaker circuitBreaker

EXPOSE 80

CMD npm start
