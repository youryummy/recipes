const app = require('../../app');
const request = require('supertest');
const Recipe = require('../../source/models/recipe');

describe('Recipes API', () => {
    describe('GET /', () => {
        it('Should return an HTML document', () => {
            return request(app).get('/').then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining('html'));
                expect(response.text).toEqual(expect.stringContaining('h1'));
            })
        })
    });

    describe("GET /recipes", () => {
        it('Should return all recipes', () =>{
            const recipes = [new Recipe({"name": "Receta ejemplo", "summary": "Es una receta", "duration": 20, "steps": ["1º Paso ejemplar","2º Paso ejemplar"], "tags":["Saludable", "Variado"]}),
                new Recipe({"name": "Caldo", "summary": "Esta rico", "duration": 5, "steps": ["1º Pasito","2º Paso"], "tags":["Verduras", "Ligero"]})
                ];
            dbFind = jest.spyOn(Recipe, "find");
            dbFind.mockImplementation(async () => Promise.resolve(recipes));

            return request(app).get("/api/v1/recipes").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalled();
            });
        });
    });

    describe("POST /recipes", () => {
        const recipe = {name: "Receta ejemplo", summary: "Es una receta", duration: 20, steps: ["1º Paso ejemplar","2º Paso ejemplar"], tags:["Saludable", "Variado"]};
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(Recipe.prototype, "save");
        });

        it("Should add a new recipe if everything is fine", () =>{
            dbSave.mockImplementation(async () => Promise.resolve(true));
            return request(app).post("/api/v1/recipes").send(recipe).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();
            })
        });


        it("Should return 500 if there is a problem with the connection", () =>{
            dbSave.mockImplementation(async () => Promise.reject("Connection failed"));
            return request(app).post("/api/v1/recipes").send(recipe).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();
            })
        });
    });
});
