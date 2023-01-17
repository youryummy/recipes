import http from "http";
import express from "express";
import { OASSwagger } from "./middleware/oas-swagger.js";
import { initialize, use } from "@oas-tools/core";
import { logger } from "@oas-tools/commons";
import Recipe from "./mongo/Recipe.js";
import _ from "lodash";
import axios from "axios";

export const deploy = async (env) => {
    const serverPort = process.env.PORT ?? 8080;
    const app = express();
    
    app.use(express.json({limit: '50mb'}));

    // Feature toggles
    const config = {}
    if (env === "production") {
        config.middleware = { 
            validator: { requestValidation: false, responseValidation: false } // Done in gateway
        }
    } else if (env === "test") {
        config.middleware = { validator: { strict: true }}
        config.logger = {level: "off"};
    }

    // Populate db with tasty recipes
    const storedRecipes = await Recipe.find({});

    if (storedRecipes.length === 0) {
        axios.get("https://tasty.p.rapidapi.com/recipes/list", {
            params: { from: "0", size: "50" },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'tasty.p.rapidapi.com'
            }
        }).then((response) => {
            Promise.all(response.data?.results.map(async r => {
                const name = r.name ?? "Unknown";
                const imageUrl = r.thumbnail_url ?? "";
                const createdBy = "Tasty!";
                const summary = r.description?.length > 0 ? r.description.replace(/<[^>]*>/g,"").replace("\n","") : "No description available";
                const duration = r.total_time_minutes ?? 0;
                const steps = r.instructions?.map(step => step.display_text) ?? [];
                const tags = _.merge(r.tags?.map(tag => tag.display_name) ?? [], r.topics?.map(topic => topic.name) ?? []);
                const ingredients = await Promise.all(r.sections?.components?.map(async comp => 
                    (await axios.get(`http://youryummy-ingredients-service/api/v1/ingredients?search=${comp.display_singular}`)).data?.result?.[0]
                )).then(ingredients => ingredients.filter(i => i !== undefined).map(i => i._id)).catch(() => []);
    
                return new Recipe({ name, imageUrl, createdBy, summary, duration, steps, tags, ingredients });
            })).then(recipes => {
                Recipe.insertMany(recipes).then(() => logger.info("Tasty recipes added to db")).catch((err) => logger.warn(`Could not add tasty recipes to db: ${err.message}`));
            });
            
        }).catch((err) => logger.warn(`Could not fetch tasty recipes, ${err.message}`));
    }

    // Initialize OAS Tools
    use(OASSwagger, {path: "/docs"});
    initialize(app, config).then(() => {
        http.createServer(app).listen(serverPort, () => {
            if (env !== "test") {
                console.log("\nApp running at http://localhost:" + serverPort);
                console.log("________________________________________________________________");
                if (config?.middleware?.swagger?.disable !== false) {
                    console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
                    console.log("________________________________________________________________");
                }
            } 
        });
    });
}

export const undeploy = () => {
  process.exit();
};

export default { deploy, undeploy };