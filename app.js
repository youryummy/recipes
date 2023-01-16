var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./source/routes');
var recipesRouter = require('./source/routes/recipes');

const
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");
const $RefParser = require("@apidevtools/json-schema-ref-parser");
var app = express();
var cachegoose = require('recachegoose');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/recipes', recipesRouter);


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Recipes Service',
    version: '1.0.0',
    description:
        'This is a REST API application made with Express. It retrieves data from YourYummy.',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./source/routes/recipes.js'],
};

const specs = swaggerJsdoc(options);
app.use(
    "/docs/swagger",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);
async function deferen(res, schema) {
  let schema_ = await $RefParser.dereference(JSON.parse(JSON.stringify(schema)));
  console.log(schema_)
  return res.send(schema_);
}
app.get('/docs/swagger.json',  (req, res) => deferen(res, specs));



//setup connection to mongo
const mongoose = require("mongoose");

// Node environment
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

const mongoPort = process.env.MONGO_PORT ?? 27017;
const mongoHost = process.env.MONGO_HOST ?? 'localhost';
const mongoDBName = process.env.MONGO_DBNAME ?? 'default-db';
const mongoProto = process.env.MONGO_PROTO ?? 'mongodb';
const mongoUser = process.env.MONGO_USER;
const mongoPwd = process.env.MONGO_PWD;
const mongoURL = `${mongoProto}://` +
`${mongoUser ? mongoUser + ":" : ""}` +
    `${mongoPwd ? mongoPwd + "@" : ""}` +
    `${mongoHost}${mongoProto == "mongodb+srv" ? "" : ":" + mongoPort}` +
    `/${mongoDBName}`;
console.log("Connecting to database: %s", mongoURL);
mongoose.set('runValidators', true);
mongoose.connect(mongoURL);
mongoose.set('strictQuery', false);

cachegoose(mongoose, {
  engine: 'memory'
});

const db = mongoose.connection;

//recover from errors
db.on("error", console.error.bind(console, "db connection error"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
