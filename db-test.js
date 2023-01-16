//setup connection to mongo
const mongoose = require("mongoose");
const cachegoose = require("recachegoose");

// Node environment
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

// Mongo connection variables
const mongoPort = process.env.MONGO_PORT ?? 27017;
const mongoHost = process.env.MONGO_HOST ?? 'localhost';
const mongoDBName = process.env.MONGO_DBNAME ?? 'default-db';
const mongoProto = process.env.MONGO_PROTO ?? 'mongodb';
const mongoUser = process.env.MONGO_USER;
const mongoPwd = process.env.MONGO_PWD;
const mongoURL = `mongodb+srv://almafe2510:clECKtEmZ07a1MbL@recipes-service.0vy5klz.mongodb.net/?retryWrites=true&w=majority`;
console.log("Connecting to database: %s", mongoURL);
mongoose.connect(mongoURL);
mongoose.set('strictQuery', false);

cachegoose(mongoose, {
    engine: 'memory'
});

const db = mongoose.connection;

//recover from errors
db.on("error", console.error.bind(console, "db connection error"));

module.exports = db