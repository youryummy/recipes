FROM node:18.12.1-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin/ ./bin
COPY source source
COPY view views
COPY public public
COPY app.js .

EXPOSE 3000

CMD npm start
