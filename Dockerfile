FROM node:18.12.1-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin/ ./bin
COPY source source

EXPOSE 3000

CMD npm start
