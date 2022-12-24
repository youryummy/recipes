const Recipe = require("../../source/models/recipe");
const dbConnect = require('../../db');

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

    it('Writes a recipe in the DB', async () => {
        const recipe = new Recipe({name: "Receta ejemplo", summary: "Es una receta", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"]});
        await recipe.save();

        recipes = await Recipe.find();
        expect(recipes).toBeArrayOfSize(1);
    });

    afterAll(async () =>{
        if(dbConnect.readyState == 1) {
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });
});
