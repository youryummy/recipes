import { logger } from "@oas-tools/commons";
import mongoose from "mongoose";
import server from '../server.js';
import Recipe from "../mongo/Recipe.js";
import axios from 'axios';

logger.configure({ level: "off" });
process.env.NODE_ENV = "test";

if (process.argv.includes("tests/integration")) {

    mongoose.set('strictQuery', false);

     await mongoose.connect("mongodb://localhost:27017/database").then(async () => {
     
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

else if (process.argv.includes("tests/components")) {
  
    mongoose.set('strictQuery', false);
    await mongoose.connect("mongodb://localhost:27017/database").then(async () => {

        
        // populate test db
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
            await mongoose.connection.db.dropCollection("recipes");                                                         
            await mongoose.disconnect();
            oldExit(code);
        };

        // Starts server
        await server.deploy(process.env.NODE_ENV).catch(err => { console.log(err); });
        
    }).catch((err) => {
        console.log("Failed to connect to test db: ", err.message);
        process.exit(1);
    });
}