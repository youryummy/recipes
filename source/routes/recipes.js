var express = require('express');
var router = express.Router();
var app = express();
var Recipe = require("../models/recipe")
const {getTastyRecipes} = require("../services/tastyService");
var debug = require('debug')('recipes-2:server')
var tastyCall = true;

/* GET recipes listing. */
/**
 * @swagger
 * /api/v1/recipes:
 *   get:
 *       description: Get all recipes
 *       responses:
 *         '200':
 *           description: Got all recipes
 *         default:
 *           description: Unexpected error */
router.get('/', async function(req, res, next) {
  try {
    const result = await Recipe.find();
    if(tastyCall) {
      await getTastyRecipes();
      tastyCall = false;
    }
    res.send(result.map((c) => c.cleanup()));
  }catch(e){
    debug("DB problem",e);
    res.sendStatus((500));
  }

/*GET recipe/id */
/**
 * @swagger
 * /api/v1/recipes/{idRecipe}:
 *   get:
 *       description: Get a recipe
 *       parameters:
 *         - required: true
 *           name: idRecipe
 *           description: idRecipe
 *           in: path
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Got a recipe
 *         default:
 *           description: Unexpected error
 */

router.get('/:id', async function (req, res, next) {
  try {
    var id = req.params.id;
    const result = await Recipe.findById(id);
    res.send(result.cleanup());
  }catch(e){
    debug("DB problem",e);
    res.sendStatus((500));
  }


});
/*POST Recipes*/
/**
 * @swagger
 * /api/v1/recipes:
 *   post:
 *       summary: Simple get operation
 *       description: Defines a simple get operation with no inputs and a complex
 */
router.post('/', async function(req, res,next){

  const {name, summary, duration, steps, tags} = req.body;

  const recipe = new Recipe({
    name,
    summary,
    duration,
    steps,
    tags
  });

  try{
    await recipe.save();
    return res.sendStatus(201);
  }catch(e){
    if(e.errors){
      debug("Validation problem when saving",e);
      res.status(400).send({error:e.message});
    }else{
      debug("DB Problem", e);
      res.sendStatus(500);
    }

  }
});

/*Delete Recipes*/
/**
 * @swagger
 * /api/v1/recipes/{idRecipe}:
 *  delete:
 *       parameters:
 *         - name: idRecipe
 *           in: path
 *           description: idRecipe
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '204':
 *           description: Recipe deleted
 *         default:
 *           description: Unexpected error
 */

router.delete('/:id', async function(req, res,next){
  try{
    const recipeToDelete = await Recipe.findById(req.params.id);
    if(recipeToDelete==null)
      res.sendStatus(404);
    else
      try {
        const result = await Recipe.deleteOne(recipeToDelete);
        if(result)
          res.sendStatus(204);
        else
          res.sendStatus(404);
      }catch(e){
        debug("DB Problem", e);
        res.sendStatus(500);
      }
  }catch (e) {
    debug("DB problem",e);
    res.sendStatus((500));
  }

});

/*Bulk delete*/
router.delete('/', async function(req, res,next){
  try {
        if(await Recipe.deleteMany({id:req.query.id})){
          tastyCall = true;
          res.sendStatus(204);
        }
  }catch(e){
        res.status(500).json({error: "DB Problem"})
  }
})
});

/*PUT /recipes/:id*/
/**
 * @swagger
 * /api/v1/recipes/{idRecipe}:
 *  put:
 *       description: Update a Recipe
 *       parameters:
 *         - required: true
 *           name: idRecipe
 *           description: idRecipe
 *           in: path
 *           schema:
 *             type: string
 *       responses:
 *         '204':
 *           description: Recipe edited
 *         default:
 *           description: Unexpected error
 */

router.put("/:id", async function (req,res,next){
  try {
    var id = req.params.id;
    const {name, summary, duration, steps, tags} = req.body;
    const recipe = await Recipe.findById(id);
    if(recipe==null)
      res.sendStatus(404)
    else
      recipe.name = name;
      recipe.summary = summary;
      recipe.duration = duration;
      recipe.steps = steps;
      recipe.tags = tags;

      await recipe.save();
      res.sendStatus(200);

  }catch (e) {
    debug("DB problem",e);
    res.sendStatus((500));
  }
});


module.exports = router;
