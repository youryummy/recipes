var express = require('express');
var router = express.Router();
var app = express();
var Recipe = require("../models/recipe")
const {getTastyRecipes} = require("../services/tastyService");
var debug = require('debug')('recipes-2:server')
var tastyCall = true;

/**
 * @swagger
 * /api/v1/recipes:
 *   get:
 *       description: Get all recipes and extract Tasty! recipes if not called before
 *       responses:
 *         '200':
 *           description: Got all recipes
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/recipe'
 *         default:
 *           description: Unexpected error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/error'
 * components:
 *   schemas:
 *     recipe:
 *       type: object
 *       required:
 *         - idRecipe
 *       properties:
 *         summary:
 *           type: string
 *         duration:
 *           type: integer
 *         name:
 *           type: string
 *         _id:
 *           type: string
 *         steps:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     error:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *       additionalProperties: true
 *   securitySchemes:
 *     apikey:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       x-acl-config:
 *         user:
 *           api/v1/recipes/{id}:
 *             "read:any": ["*"]
 *             "update:own": ["*"]
 *             "delete:own": ["*"]
 *           api/v1/recipes:
 *             "read:any": ["*"]
 *             "create:own": ["*"]
 *         admin:
 *           api/v1/recipes:
 *             "read:any": ["*"]
 *             "create:any": ["*"]
 *           api/v1/recipes/{id}:
 *             "read:any": ["*"]
 *             "update:any": ["*"]
 *             "delete:any": ["*"]

 *         */
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
 *    post:
 *       description: Create a new recipe
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/recipe'
 *             examples:
 *               '0':
 *                 value: "\t{\r\n\t\t\"name\": \"Turron de chocolate\",\r\n\t\t\"summary\": \"Esta muy bueno\",\r\n\t\t\"duration\": 30,\r\n\t\t\"steps\": [\r\n\t\t\t\"1º Parte chocolate\",\r\n\t\t\t\"2º Añade almendras a la mezcla\",\r\n\t\t\t\"3º Hornear\"\r\n\t\t],\r\n\t\t\"tags\": [\r\n\t\t\t\"Chocolate\",\r\n\t\t\t\"Navidad\",\r\n\t\t\t\"Dulce\"\r\n\t\t]\r\n\t}"
 *               '1':
 *                 value: "\t{\r\n\t\t\"name\": \"Sopita de estrellitas\",\r\n\t\t\"summary\": \"Calentita y con muchos nutrientes\",\r\n\t\t\"duration\": 20,\r\n\t\t\"steps\": [\r\n\t\t\t\"1º Compra el caldo\",\r\n\t\t\t\"2º Calientalo\",\r\n\t\t\t\"3º Añade estrellitas\"\r\n\t\t],\r\n\t\t\"tags\": [\r\n\t\t\t\"Saludable\",\r\n\t\t\t\"Nocturno\",\r\n\t\t\t\"Infantil\"\r\n\t\t]\r\n\t}"
 *         description: Recipe to be created
 *         required: true
 *       responses:
 *         '201':
 *           description: Recipe created
 *         default:
 *           description: Unexpected error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/error'
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
 *    delete:
 *       description: Delete all recipes
 *       parameters:
 *         - required: true
 *           name: idRecipe
 *           description: idRecipe
 *           in: path
 *           schema:
 *             type: string
 *       responses:
 *         '204':
 *           description: Recipe deleted
 *         default:
 *           description: Unexpected error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/error'
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
  /**
   * @swagger
   * /api/v1/recipes:
   *    delete:
   *       description: Delete all recipes and reset Get Tasty! recipes
   *       responses:
   *         '204':
   *           description: All recipes deleted
   *         default:
   *           description: Unexpected error
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/error'
   */

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
 *    put:
 *       description: Edit an actual recipe
 *       parameters:
 *         - required: true
 *           name: idRecipe
 *           description: idRecipe
 *           in: path
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref:  '#/components/schemas/recipe'
 *             examples:
 *               '0':
 *                 value: "\t{\r\n\t\t\"_id\": \"63a6ce7f6f88a46c931fd141\",\r\n\t\t\"name\": \"Honey Dishes That Are Must-Haves\",\r\n\t\t\"summary\": \"Ain't nothin' sweeter than honey. Check out these addictive and fun recipes that use honey in the best way! There arguably isn't a better snack than the Honey Lime Sriracha Chicken Poppers. One-Pan Honey Garlic Chicken is an easy-to-make meal that will leave you satisfied! Make those wings better than ever with the tastiest Honey Garlic Chicken Wings!\",\r\n\t\t\"duration\": 0,\r\n\t\t\"steps\": [\r\n\t\t\t\"Instrucciones\"\r\n\t\t],\r\n\t\t\"tags\": [\r\n\t\t\t\"No hay etiquetas\"\r\n\t\t]\r\n\t}"
 *       responses:
 *         '204':
 *           description: Recipe edited
 *         default:
 *           description: Unexpected error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/error'
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
