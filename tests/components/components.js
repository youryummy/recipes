const chai = require('chai')
const chaiHttp = require('chai-http');


chai.use(chaiHttp);
chai.expect();
chai.should();

let recipeId;
let recipePOST = { name: "test_POST", summary: "test_POST", duration: 1, steps: ["test_POST"], tags: ["test_POST"], createdBy:"test_POST", imageUrl:"test_POST" }
let recipePUT = { name: "test_UPDATE", summary: "test_UPDATE", duration: 2, steps: ["test_UPDATE"], tags: ["test_UPDATE"], createdBy:"test_UPDATE", imageUrl:"test_UPDATE" }

const apiURL = "http://localhost"
describe("Integration test", function() {


describe('get Recipes', () => {
    it('should return all recipes', (done) => {
        chai.request(apiURL)
            .get('/api/v1/recipes')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                console.log("Result length: " + res.body.length)
                chai.expect(res.body).to.have.length.greaterThan(1);
                done();

            })
    })
})

describe('post Recipe', () => {
    it('should add a recipe', (done) => {
        chai.request(apiURL)
            .post('/api/v1/recipes')
            .send(recipePOST)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('name').eql(recipePOST.name);
                res.body.should.have.property('summary').eql(recipePOST.summary);
                res.body.should.have.property('duration').eql(recipePOST.duration);
                res.body.should.have.property('steps').eql(recipePOST.steps);
                res.body.should.have.property('tags').eql(recipePOST.tags);
                res.body.should.have.property('createdBy').eql(recipePOST.createdBy);
                res.body.should.have.property('imageUrl').eql(recipePOST.imageUrl);
                recipeId = res.body._id;
                done();

            })
    })
})
describe('get recipe by Id recipe', () => {
    it('should get recipe by id recipe', (done) => {
        chai.request(apiURL)
            .get('/api/v1/recipes/' + recipeId)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('name').eql(recipePOST.name);
                res.body.should.have.property('summary').eql(recipePOST.summary);
                res.body.should.have.property('duration').eql(recipePOST.duration);
                res.body.should.have.property('steps').eql(recipePOST.steps);
                res.body.should.have.property('tags').eql(recipePOST.tags);
                res.body.should.have.property('createdBy').eql(recipePOST.createdBy);
                res.body.should.have.property('imageUrl').eql(recipePOST.imageUrl);
                done();
            })
    })
})

    describe('get recipe by Id recipe', () => {
        it('should get recipe by id recipe', (done) => {
            chai.request(apiURL)
                .get('/api/v1/recipes/' + recipeId)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql(recipePOST.name);
                    res.body.should.have.property('summary').eql(recipePOST.summary);
                    res.body.should.have.property('duration').eql(recipePOST.duration);
                    res.body.should.have.property('steps').eql(recipePOST.steps);
                    res.body.should.have.property('tags').eql(recipePOST.tags);
                    res.body.should.have.property('createdBy').eql(recipePOST.createdBy);
                    res.body.should.have.property('imageUrl').eql(recipePOST.imageUrl);
                    done();
                })
        })
    })


    describe('put Recipe', () => {
    it('should update recipe', (done) => {
        chai.request(apiURL)
            .put('/api/v1/recipes/' + recipeId)
            .send(recipePUT)
            .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.a('object');
                done();
            })
    })
})

describe('delete Recipe', () => {
    it('should delete recipe', (done) => {
        chai.request(apiURL)
            .delete('/api/v1/recipes/' + recipeId)
            .end((err, res) => {
                res.should.have.status(204);
                done();
            })
    })
})
    describe('bulk delete', () => {
        it('should delete all recipes', (done) => {
            chai.request(apiURL)
                .delete('/api/v1/recipes')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                })
        })
    })


})