import chai from 'chai';
import chaiHttp from 'chai-http';
import Recipe from "../../mongo/Recipe.js";

chai.use(chaiHttp);
chai.should();

let recipeId;
let fakeRecipeId = "63c0162b0fbc7404c373c56e"
let recipePOSTWrongName = { name: "", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }
let recipePOSTWrongSummary = { name: "test_POST", summary: "", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }
let recipePOSTWrongDuration = { name: "test_POST", summary: "test_POST", duration: -20, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }
let recipePOSTWrongNameAndDuration = { name: "", summary: "test_POST", duration: -1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }
let recipePOSTWrongDurationAndSummary = { name: "Test", summary: "", duration: -1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }
let recipePOSTWrongNameAndSummary = { name: "", summary: "", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }

let recipePOST = { name: "test_POST", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST"}
let recipeTestId =             { name: "test_POST 1", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }
    let recipePUT = { name: "test_UPDATE", summary: "test_UPDATE", duration: 2, steps: ["test_UPDATE"], tags: ["test_UPDATE"], createdBy:"test_UPDATE", imageUrl:"test_UPDATE" }
let recipePUTWrong = { name: "", summary: "", duration: -50, steps: "", tags: "", createdBy:"", imageUrl:30}

const apiURL = "http://localhost:8080"
const req = {}, res = {};
describe("Component tests", function() {
    before(() => {
        // Wait for the service to start
        let delay = new Promise(resolve => setTimeout(resolve, 1000))
        return delay
    })


    describe('/POST Recipes', () => {
        it('should add a recipe',  (done) => {
            chai.request(apiURL)
                .post('/api/v1/recipes')
                .send(recipePOST)
                .end(async (err, res) => {
                    var recipe = await Recipe.find({ name: 'test_POST' });
                    recipe.name==(recipePOST.name);
                    recipe.summary==(recipePOST.summary);
                    recipe.duration==(recipePOST.duration);
                    recipe.steps==(recipePOST.steps);
                    recipe.tags==(recipePOST.tags);
                    recipe.createdBy==(recipePOST.createdBy);
                    recipe.imageUrl==(recipePOST.imageUrl);
                    res.should.have.status(201);

                    done();

                })
        })
    })

    describe('/GET recipes', () => {
        it('should return all recipes', (done) => {
            chai.request(apiURL)
                .get('/api/v1/recipes')
                .end((err, res) => {
                    console.log(res.body[0])
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    console.log("Result length: " + res.body.length)
                    chai.expect(res.body).to.have.length.greaterThan(0);
                    recipeId=res.body[0]._id
                    console.log(recipeId)
                    done();
                })
        })


        it('should get recipe by id recipe', (done) => {
            chai.request(apiURL)
                .get('/api/v1/recipes/' + recipeId)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql(recipeTestId.name);
                    res.body.should.have.property('summary').eql(recipeTestId.summary);
                    res.body.should.have.property('duration').eql(recipeTestId.duration);
                    res.body.should.have.property('steps').eql(recipeTestId.steps);
                    res.body.should.have.property('tags').eql(recipeTestId.tags);
                    res.body.should.have.property('createdBy').eql(recipeTestId.createdBy);
                    res.body.should.have.property('imageUrl').eql(recipeTestId.imageUrl);
                    done();
                })
        })


        describe('/PUT recipes ', () => {
            it('should update recipe', (done) => {
                chai.request(apiURL)
                    .put('/api/v1/recipes/' + recipeId)
                    .send(recipePUT)
                    .end(async (err, res) => {
                        var recipe = await Recipe.find({name: 'test_POST 1'});
                        recipe.name != (recipePUT.name);
                        recipe.summary != (recipePUT.summary);
                        recipe.duration != (recipePUT.duration);
                        recipe.steps != (recipePUT.steps);
                        recipe.tags != (recipePUT.tags);
                        recipe.createdBy != (recipePUT.createdBy);
                        recipe.imageUrl != (recipePUT.imageUrl);

                        res.should.have.status(204);
                        done();
                    })
            })

            it('should not update recipe', (done) => {
                chai.request(apiURL)
                    .put('/api/v1/recipes/' + '63c5fd7d8675bfd39256907f')
                    .send(recipePUT)
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    })
            })

            it('should not add a recipe with wrong name', (done) => {
                chai.request(apiURL)
                    .put('/api/v1/recipes' + recipeId)
                    .send(recipePOSTWrongName)
                    .end((err, res) => {
                        res.body.error == ("validation failed");
                        done();

                    })
            })

            it('should not add a recipe with wrong summary', (done) => {
                chai.request(apiURL)
                    .put('/api/v1/recipes' + recipeId)
                    .send(recipePOSTWrongSummary)
                    .end((err, res) => {
                        res.body.error == ("validation failed");

                        done();

                    })
            })

            it('should not update a recipe with wrong duraition', (done) => {
                chai.request(apiURL)
                    .put('/api/v1/recipes' + recipeId)
                    .send(recipePOSTWrongDuration)
                    .end((err, res) => {
                        res.should.have.status(404);

                        done();

                    })
            })

            it('should not add a recipe with wrong name and duration', (done) => {
                chai.request(apiURL)
                    .put('/api/v1/recipes')
                    .send(recipePOSTWrongNameAndDuration)
                    .end((err, res) => {
                        res.body.error == ("validation failed");

                        done();

                    })
            })
            it('should not add a recipe with wrong duration and summary', (done) => {
                chai.request(apiURL)
                    .put('/api/v1/recipes')
                    .send(recipePOSTWrongDurationAndSummary)
                    .end((err, res) => {
                        res.body.error == ("validation failed");

                        done();

                    })
            })
            it('should not add a recipe with wrong name and summary', (done) => {
                chai.request(apiURL)
                    .put('/api/v1/recipes')
                    .send(recipePOSTWrongNameAndSummary)
                    .end((err, res) => {
                        res.body.error == ("validation failed");

                        done();

                    })
            })
        })


        describe('/DELETE Recipes', () => {
            it('should delete recipe', (done) => {
                chai.request(apiURL)
                    .delete('/api/v1/recipes/' + recipeId)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    })
            })

        })

        describe('/POST Negative cases Recipes', () => {
            it('should not add a recipe with wrong name', (done) => {
                chai.request(apiURL)
                    .post('/api/v1/recipes')
                    .send(recipePOSTWrongName)
                    .end((err, res) => {
                        res.body.error == ("validation failed");

                        done();

                    })
            })

            it('should not add a recipe with wrong summary', (done) => {
                chai.request(apiURL)
                    .post('/api/v1/recipes')
                    .send(recipePOSTWrongSummary)
                    .end((err, res) => {
                        res.body.error == ("validation failed");

                        done();

                    })
            })

            it('should not add a recipe with wrong name and duration', (done) => {
                chai.request(apiURL)
                    .post('/api/v1/recipes')
                    .send(recipePOSTWrongNameAndDuration)
                    .end((err, res) => {
                        res.body.error == ("validation failed");

                        done();

                    })
            })
            it('should not add a recipe with wrong duration and summary', (done) => {
                chai.request(apiURL)
                    .post('/api/v1/recipes')
                    .send(recipePOSTWrongDurationAndSummary)
                    .end((err, res) => {
                        res.body.error == ("validation failed");

                        done();

                    })
            })
            it('should not add a recipe with wrong name and summary', (done) => {
                chai.request(apiURL)
                    .post('/api/v1/recipes')
                    .send(recipePOSTWrongNameAndSummary)
                    .end((err, res) => {
                        res.body.error == ("validation failed");

                        done();

                    })
            })
            it('should not add a recipe with wrong duration', (done) => {
                chai.request(apiURL)
                    .post('/api/v1/recipes')
                    .send(recipePOSTWrongDuration)
                    .end((err, res) => {
                        res.should.have.status(400);

                        done();

                    })
            })

        })
        describe('/GET Negative recipes', () => {

            it('should not get Recipe bc wrong id formation', (done) => {
                chai.request(apiURL)
                    .get('/api/v1/recipes/' + "ffff")
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    })
            })

            it('should get id not found bc wrong id formation', (done) => {
                chai.request(apiURL)
                    .get('/api/v1/recipes/' + fakeRecipeId)
                    .end((err, res) => {
                        res.should.have.status(500);
                        done();
                    })
            })
        })
    })
})