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

var app = express();


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
    title: 'Express API for YourYummy',
    version: '1.0.0',
    description:
        'This is a REST API application made with Express. It retrieves data from YourYummy.',
  },
  servers: [
    {
      url: 'http://localhost',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./source/routes/recipes.js'],
};

const specs = swaggerJsdoc(options);
app.use(
    "/docs/swagger.json",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

//setup connection to mongo
const mongoose = require("mongoose");
const DB_URL = (process.env.DB_URL || "mongodb://localhost/test");
console.log("Connecting to database: %s", DB_URL);
mongoose.connect(DB_URL);
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
