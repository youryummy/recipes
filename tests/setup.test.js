import { logger } from "@oas-tools/commons";

logger.configure({ level: "off" });
process.env.NODE_ENV = "test";

if (process.argv.includes("tests/integration")) {
    const password = bcrypt.hashSync("Test1234", 10);

    mongoose.set('strictQuery', false);

    await mongoose.connect("mongodb://localhost:27017/test", {connectTimeoutMS: 3000, serverSelectionTimeoutMS: 3000 }).then(async () => {


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