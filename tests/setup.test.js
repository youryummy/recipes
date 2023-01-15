import Recipe from Recipe
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
const mongoose = require("mongoose");
const Recipe = require("../source/routes/recipes.js")
const dotenv = require("dotenv");

process.env.NODE_ENV = "test";

// Populate test db and cleanup after integration tests
if (process.argv.includes("tests/integration")) {
    
    mongoose.set('strictQuery', false);
    await mongoose.connect("mongodb://localhost:27017/test", {connectTimeoutMS: 3000, serverSelectionTimeoutMS: 3000 }).then(async () => {
        await Recipe.insertMany([
            { name: "test_POST 1", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 2", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 3" , summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 4", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 5", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 6", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 7", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 8", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }
        ]);

        // Cleans db after tests
        const oldExit = process.exit;
        process.exit = async (code) => {
            await mongoose.connection.db.dropCollection("account");                                                         
            await mongoose.disconnect();
            oldExit(code);
        };
    }).catch((err) => {
        console.log("Failed to connect to test db: ", err.message);
        process.exit(1);
    });
}

else if (process.argv.includes("tests/component")) {
    dotenv.config({ path: ".env.test" }); // load test env variables

    const mongoHost = process.env.MONGO_HOST;
    const mongoDBName = process.env.MONGO_DBNAME;
    const mongoProto = process.env.MONGO_PROTO;
    const mongoUser = process.env.MONGO_USER;
    const mongoPwd = process.env.MONGO_PWD;
    
    const mongoURL = `${mongoProto}://${mongoUser}:${mongoPwd}@${mongoHost}/${mongoDBName}`;

    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURL).then(async () => {
        
        // populate test db
        await Account.insertMany([
            { name: "test_POST 1", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 2", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 3" , summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 4", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 5", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 6", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 7", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" },
            { name: "test_POST 8", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }
        ]);

        // Cleans db after tests
        const oldExit = process.exit;
        process.exit = async (code) => {
            await mongoose.connection.db.dropCollection("recipes");                                                         
            await mongoose.disconnect();
            oldExit(code);
        };

    }).catch((err) => {
        console.log("Failed to connect to test db: ", err.message);
        process.exit(1);
    });
}