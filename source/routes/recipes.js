var express = require('express');
var router = express.Router();
var Recipe = require("../models/recipe")
var debug = require('debug')('recipes-2:server')

/* GET recipes listing. */
router.get('/', async function(req, res, next) {
  try {
    const result = await Recipe.find();
    res.send(result.map((c) => c.cleanup()));
    //res.send(result);
  }catch(e){
    debug("DB problem",e);
    res.sendStatus((500));
  }

});
/*POST Recipes*/
router.post('/', async function(req, res,next){
  const {name, summary, verified, duration, steps, tags} = req.body;

  const recipe = new Recipe({
    name,
    summary,
    verified,
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
router.delete('/:id', function(req, res,next){
  var id = req.params.id-1;
  if (id > -1) {
    recipes.splice(id,1);
    res.sendStatus(204);
  }else{
    res.sendStatus(404);
  }
})


/*GET recipe/id */
router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  var result = recipes.find(r => {
    return r.id == id;
  });
  if(result) {
    res.send({"result":result});
  }else{
    res.sendStatus(404);
  }

})

/*PUT /recipes/:id*/
router.put("/:id", function (req,res,next){
  var id = req.params.id;
  var recipe = recipes.find(r => {
    return r.id == id;
  })
    recipe.name = req.body.name;
    recipe.summary = req.body.summary;
    recipe.duration = req.body.duration;
    recipe.steps = req.body.steps;
    recipe.tags = req.body.tags;

    res.sendStatus(200);

})

module.exports = router;
