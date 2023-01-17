import Recipe from "../mongo/Recipe.js";
import mongoose from "mongoose";
import { logger } from "@oas-tools/commons";
import axios from "axios";
import recachegoose from "recachegoose";
import { CircuitBreaker } from "../circuitBreaker/circuitBreaker.js";

recachegoose(mongoose, {
  engine: 'memory'
});


export async function get(_req, res) {
  const username = res.locals.oas.params?.username;
  const plan = res.locals.oas.params?.plan;
  
  let error;
  let recipesResult = [];
  if (username && plan) { // Call recommender to obtain ordered list of recipes
    await axios.get(`http://recommendations/api/v1/recommendation/${username}/${plan}`)
    .then(async (recommenderResponse) => {
      const recipesIds = recommenderResponse.data;
      recipesResult = await Promise.all(recipesIds.map(async (recipeId) => await Recipe.findById(recipeId)));
    }).catch((err) => {
      logger.error("Could not fetch recommendations", err.message);
      error = err;
    });
  } else {  // Return all recipes from db
    await Recipe.find({}).cache(10).then((recipes) => {
      recipesResult = [...recipes];
    }).catch((err) => {
      logger.error("Could not fetch recipes", err.message);
      error = err;
    });
  }

  /* Check if previous call returned error, if so, return 500*/
  if (error) {
    res.status(500).send({ message: "Unexpected Error ocurred, try again later" });
  } else {
    recipesResult = recipesResult.map((r) => {
      return {
        ...r._doc,
        ingredients: r.ingredients?.map(async (ingredient) => {
          await axios.get(`http://youryummy-ingredients-service/api/v1/ingredients/${ingredient}`).catch((err) => logger.warn((`Could not fetch ingredient ${ingredient}: ${err.message}`)));
        }).filter((i) => i !== undefined) ?? []
      }
    });

    res.send(recipesResult);
  }
}

export function post(req, res) {
  const recipe = new Recipe(req.body);
  CircuitBreaker.getBreaker(Recipe).fire("create", recipe).then(() => {
    res.status(201).send();
  }).catch((err) => {
    logger.error(`Could not save recipe: ${err.message}`);
    if (err.message?.toLowerCase().includes("validation failed")) {
      res.status(400).send({ message: "Invalid recipe" });
    } else {
      res.status(500).send({ message: "Unexpected Error ocurred, try again later" });
    }
  });
}

export function getById(_req, res) {
  const id = res.locals.oas.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ message: "Invalid ID" });
  } else {
    CircuitBreaker.getBreaker(Recipe).fire("findById", { _id: id }).then((r) => {
      if (r) {
        res.send(r);
      } else {
        res.status(404).send({ message: "Recipe not found" });
      }
    }).catch((err) => {
      logger.error(`Could not fetch recipe: ${err.message}`);
      res.status(500).send({ message: "Unexpected Error ocurred, try again later" });
    });
  }
}

export function update(_req, res) {
  const id = res.locals.oas.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ message: "Invalid ID" });
  } else {
    CircuitBreaker.getBreaker(Recipe).fire("findByIdAndUpdate", { _id: id }, res.locals.oas.body, { runValidators: true }).then((oldRecipe) => {
      if (!oldRecipe) res.status(404).send({ message: "Recipe not found" });
      else res.status(204).send();
    }).catch((err) => {
      logger.error(`Could not update recipe: ${err.message}`);
      if (err.message?.toLowerCase().includes("validation failed")) {
        res.status(400).send({ message: "Invalid recipe" });
      } else {
        res.status(500).send({ message: "Unexpected Error ocurred, try again later" });
      }
    });
  }
}

export function remove(_req, res) {
  const id = res.locals.oas.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ message: "Invalid ID" });
  } else {
    CircuitBreaker.getBreaker(Recipe).fire("findByIdAndDelete", { _id: id }).then((result) => {
      res.status(204).send();
    }).catch((err) => {
      logger.error(`Could not delete recipe: ${err.message}`);
      res.status(500).send({ message: "Unexpected Error ocurred, try again later" });
    });
  }
}