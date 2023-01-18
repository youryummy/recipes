const dbConnect = require('../../db-test');
const Recipe = require('../../source/models/recipe');
const mongoose = require("mongoose")
jest.setTimeout(30000);

describe('Contacts DB connection', () => {
    beforeAll((done) => {
        if(dbConnect.readyState == 1) {
            done();
        }else{
            dbConnect.on("connected", () => done());
        }
    });

    beforeEach(async () => {
        await Recipe.deleteMany({});
    });

    it('Get all recipes from the DB', async () => {
        const recipe = new Recipe({name: "Receta ejemplo", summary: "Es una receta", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu", imageUrl:""});
        await recipe.save();

        const recipe_ = new Recipe({name: "Receta ejemplo 2", summary: "Es una receta 2", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu 2", imageUrl:""});
        await recipe_.save();

        recipes = await Recipe.find();

        expect(recipes).toBeArrayOfSize(2);
    });

    it('Should not get any recipe from the DB', async () =>{
       recipes = await Recipe.find();
       expect(recipes).toStrictEqual([]);
    });


    it('Get a recipes by Id in the DB', async () => {
        const recipe = new Recipe({name: "Receta ejemplo", summary: "Es una receta", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu", imageUrl:""});
        await recipe.save();

        const recipe_ = new Recipe({name: "Receta ejemplo 2", summary: "Es una receta 2", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu 2", imageUrl:""});
        await recipe_.save();

        recipeId = await Recipe.find();
        console.log(recipeId)

        expect(1).toBe(1);
    });

    it('Should not get a recipe by a fakeId', async () => {
        const result = await Recipe.findById("63c0162b0fbc7404c373c56e");
        expect(result).toBe(null);
    });

    it('Writes a recipe in the DB', async () => {
        const recipe = new Recipe({name: "Receta ejemplo", summary: "Es una receta", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu", imageUrl:""});
        await recipe.save();

        recipes = await Recipe.find();
        expect(recipes).toBeArrayOfSize(1);
    });

    it('Should not write a recipe in the DB', async () =>{
        try{
            const recipe = new Recipe({name: "Receta ejemplo", summary: "Es una receta", duration: -1, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu", imageUrl:""});
            await recipe.save()
        } catch (e) {
            expect(e).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });

    it('Update a recipe in the DB', async () => {
        const recipe = new Recipe({name: "Receta ejemplo", summary: "Es una receta", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu", imageUrl:""});
        await recipe.save();

        const recipe_ = new Recipe({name: "Receta ejemplo editado", summary: "Es una receta editado", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu editado", imageUrl:""});

        recipeFound=await Recipe.find();
        recipeFound[0].name = recipe_.name;
        recipeFound[0].summary = recipe_.summary;
        recipeFound[0].duration = recipe_.duration;
        recipeFound[0].steps = recipe_.steps;
        recipeFound[0].tags = recipe_.tags;
        recipeFound[0].createdBy = recipe_.createdBy;
        recipeFound[0].imageUrl = recipe_.imageUrl;
        console.log(recipeFound)
        await recipeFound[0].save();


        recipeEdited = await Recipe.find();
        expect(recipeEdited[0].name).toBe(recipe_.name);
    });

    it('Should not update a recipe in the DB',async() =>{
        try{
            const recipe = new Recipe({name: "Receta ejemplo", summary: "Es una receta", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu", imageUrl:""});
            await recipe.save();
            const recipe_ = new Recipe({name: "", summary: "", duration: -1, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu editado", imageUrl:""});
            recipeFound=await Recipe.find();
            recipeFound[0].name = recipe_.name;
            recipeFound[0].summary = recipe_.summary;
            recipeFound[0].duration = recipe_.duration;
            recipeFound[0].steps = recipe_.steps;
            recipeFound[0].tags = recipe_.tags;
            recipeFound[0].createdBy = recipe_.createdBy;
            recipeFound[0].imageUrl = recipe_.imageUrl;
            await recipeFound[0].save();
        }catch (e) {
            expect(e).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });

    it('Delete all recipes in the DB', async () => {
        const recipe = new Recipe({name: "Receta ejemplo", summary: "Es una receta", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu", imageUrl:""});
        await recipe.save();

        const recipe_ = new Recipe({name: "Receta ejemplo 2", summary: "Es una receta 2", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu 2", imageUrl:""});
        await recipe_.save();


        await Recipe.deleteMany({});
        recipes = await Recipe.find();
        expect(recipes).toBeArrayOfSize(0);
    });

    it('Should not delete any recipe', async () => {
        try {
            await Recipe.deleteMany({});
            recipes = await Recipe.find();
        }catch (e) {
            expect(e).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });


    it('Delete a recipes by Id in the DB', async () => {
        const recipe = new Recipe({name: "Receta ejemplo", summary: "Es una receta", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu", imageUrl:""});
        await recipe.save();

        const recipe_ = new Recipe({name: "Receta ejemplo 2", summary: "Es una receta 2", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"],createdBy:"Joselu 2", imageUrl:""});
        await recipe_.save();

        recipeId = await Recipe.find();
        console.log(recipeId)

        await Recipe.findOneAndDelete(recipeId);
        recipes = await Recipe.find();
        expect(recipes).toBeArrayOfSize(1);
    });
    
    it('Should not delete and unexistent recipe', async () =>{
        try {
            await Recipe.findOneAndDelete("63c0162b0fbc7404c373c56e")
        }catch (e) {
            expect(e).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(e.errors.completed).toBeDefined();
        }
    });


    afterAll(async () =>{
        if(dbConnect.readyState == 1) {
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });
});