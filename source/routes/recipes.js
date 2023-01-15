var express = require('express');
var router = express.Router();
var app = express();
var Recipe = require("../models/recipe")
const {getTastyRecipes} = require("../services/tastyService");
var debug = require('debug')('recipes-2:server')
var tastyCall = true;
const CircuitBreaker = require("../../circuitBreaker/circuitBreaker.js");
/**
 * @swagger
 * /api/v1/recipes:
 *   get:
 *       description: Get all recipes and extract Tasty! recipes if not called before
 *       parameters:
 *         - name: username
 *           description: username
 *           in: query
 *           schema:
 *             type: string
 *         - name: plan
 *           description: plan
 *           in: query
 *           schema:
 *             type: string
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
 *         createdBy:
 *           type: string
 *         imageUrl:
 *           type: string
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
    const username = req.query.username;
    const plan = req.query.plan;

    if (tastyCall) {
      await getTastyRecipes();
      tastyCall = false;
    }
    if(username==undefined||plan==undefined){
      var result = await Recipe.find().cache(10);
      res.send(result.map((c) => c.cleanup()));
    }else if(username!=undefined&&plan!=undefined){
      CircuitBreaker.getBreaker(axios, res, {onlyOpenOnInternalError: true})
              .fire("get", `http://recommendations/api/v1/recommendation/${username}/${plan}`)
              .then((rbresponse) => {
                console.log("Dentro 2")
                let list = [];
                for(r in rbresponse){
                  CircuitBreaker.getBreaker(Recipe).fire("findById", rbresponse[r]).then((result) => {
                    if (result) {
                      list.push(result)
                    } else {
                      res.status(404).send({message: `Recipe with id '${id}' does not exist`})
                    }
                  }).catch((err) => {
                    res.status(500).send({message: "Unexpected error ocurred, please try again later"});
                  });
                }
                res.send(list.map((c) => c.cleanup()));              
              }).catch((err) => {
                  res.status(err.response?.status ?? 500).send({ message: err.response?.data?.message ?? "Unexpected error ocurred, please try again later" });
              });
    }

  } catch (e) {
    debug("DB problem", e);
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
    const idRecipe = req.params.id;

    CircuitBreaker.getBreaker(Recipe).fire("findById", idRecipe).then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(404).send({message: `Recipe with id '${id}' does not exist`})
      }
    }).catch((err) => {
      res.status(500).send({message: "Unexpected error ocurred, please try again later"});
    });
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
  router.post('/', async function (req, res, next) {
    const {name, summary, duration, steps, tags, createdBy, imageUrl} = req.body;

    const recipe = new Recipe({
      name,
      summary,
      duration,
      steps,
      tags,
      createdBy,
      imageUrl
    });

    CircuitBreaker.getBreaker(Recipe).fire("create", recipe).then((result) => {
      if (result) {
        return res.send(recipe);
      } else {
        res.sendStatus(404);
      }
    })
        .catch((err) => {
          res.status(500).send({error: err.message});
        });
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

  router.delete('/:id', async function (req, res, next) {
    const idRecipe = req.params.id;
    CircuitBreaker.getBreaker(Recipe).fire("findByIdAndDelete", idRecipe).then((result) => {
      if (result) {
        res.status(204).send({message: `Recipe with id '${idRecipe}' deleted successfully`});
      } else {
        res.status(404).send({message: `Recipe with id '${idRecipe}' does not exist`})
      }
    }).catch((err) => {
      res.status(500).send({message: "Unexpected error ocurred, please try again later"});
    });
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

  router.delete('/', async function (req, res, next) {
    CircuitBreaker.getBreaker(Recipe).fire("deleteMany", {id:req.query.id}).then((result) => {
      if (result) {
        tastyCall = true;
        res.status(204).send({message: `Recipes deleted successfully`});
      } else {
        res.status(404).send({message: "No recipes to delete"})
      }
    }).catch((e) => {
      res.status(500).send({message: "Unexpected error ocurred, please try again later"});
    });
  });
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
 *                 $ref:  '#/components/schemas/recipe'
 *             examples:
 *               '0':
 *                 value: "\t{\r\n\t\t\"_id\": \"63a6ce7f6f88a46c931fd141\",\r\n\t\t\"name\": \"Honey Dishes That Are Must-Haves\",\r\n\t\t\"summary\": \"Ain't nothin' sweeter than honey. Check out these addictive and fun recipes that use honey in the best way! There arguably isn't a better snack than the Honey Lime Sriracha Chicken Poppers. One-Pan Honey Garlic Chicken is an easy-to-make meal that will leave you satisfied! Make those wings better than ever with the tastiest Honey Garlic Chicken Wings!\",\r\n\t\t\"duration\": 0,\r\n\t\t\"steps\": [\r\n\t\t\t\"Instrucciones\"\r\n\t\t],\r\n\t\t\"tags\": [\r\n\t\t\t\"No hay etiquetas\"\r\n\t\t]\r\n\t}"
 *         description: Recipe to be edited
 *         required: true
 *       responses:
 *         '201':
 *           description: Recipe edited
 *         default:
 *           description: Unexpected error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/error'
 */

router.put("/:id", async function (req,res,next){
  const _id = req.params.id;
  const body =req.body;

  CircuitBreaker.getBreaker(Recipe).fire("findByIdAndUpdate", _id, body).then((result) => {
    if (result) {
      res.status(201).send({message: `Recipe with id '${_id}' updated successfully!`});
    } else {
      res.status(404).send({message: `Recipe with id '${_id}' does not exist`})
    }
  }).catch((err) => {
    res.status(500).send({ message: "Unexpected error ocurred, please try again later" });
  });

});

module.exports = router;
