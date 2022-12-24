//setup connection to mongo
const mongoose = require("mongoose");
const DB_URL = (process.env.DB_URL || "mongodb://localhost/test");
console.log("Connecting to database: %s", DB_URL);

mongoose.connect(DB_URL);
const db = mongoose.connection;

//recover from errors
db.on("error", console.error.bind(console, "db connection error"));

module.exports = db;
