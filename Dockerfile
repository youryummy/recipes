FROM node:18.12.1-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin/ ./bin
COPY source/Misc/public/ ./source/public
COPY source/routes/ ./source/routes
COPY source/Misc/views/ ./source/Misc/views
COPY source/services/ ./source/services
COPY app.js .

EXPOSE 3000

CMD npm start
