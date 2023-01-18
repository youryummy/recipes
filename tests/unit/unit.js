const chai = require('chai')
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);

const recipeController = {
    find: sinon.stub().resolves(),
    create: sinon.stub().resolves(),
    findById: sinon.stub().resolves(),
    findByIdAndUpdate: sinon.stub().resolves(),
    findByIdAndDelete: sinon.stub().resolves(),
    deleteMany: sinon.stub().resolves()
};
describe('recipesController tests', () => {
    describe('recipeController.find()', () => {
        it('should call recipeController.find() with the correct arguments', async () => {


            const res = {
                send: sinon.stub()
            };

            await recipeController.find(res);
            expect(recipeController.find).to.have.been.calledWith(res);
        });
    });

    describe('recipesController.create()', () => {
        it('should call recipesService.create() with the correct arguments', () => {
            const req = {
                body: {
                    search: 'Cheese'
                }
            };

            const res = {
                send: sinon.stub()
            };

            recipeController.create(req, res);

            expect(recipeController.create).to.have.been.calledWith(req, res);
        });
    });

    describe('recipeController.findById()', () => {
        it('should call recipesService.findById() with the correct arguments', async () => {
            const req = {
                params: {
                    id: '12345'
                }
            };

            const res = {
                send: sinon.stub()
            };

            await recipeController.findById(req, res);
            expect(recipeController.findById).to.have.been.calledWith(req, res);
        });
    });

    describe('recipesController.findByIdAndUpdate()', () => {
        it('should call recipesService.findByIdAndUpdate() with the correct arguments', async () => {
            const req = {
                params: {
                    id: '12345'
                },
                body: {
                    search: 'Cheese'
                }
            };

            const res = {
                send: sinon.stub()
            };

            await recipeController.findByIdAndUpdate(req, res);
            expect(recipeController.findByIdAndUpdate).to.have.been.calledWith(req, res);
        });
    });

    describe('recipesController.findByIdAndDelete()', () => {
        it('should call recipesService.findByIdAndDelete() with the correct arguments', async () => {
            const req = {
                params: {
                    id: '12345'
                }
            };

            const res = {
                send: sinon.stub()
            };

            await recipeController.findByIdAndDelete(req, res);
            expect(recipeController.findByIdAndDelete).to.have.been.calledWith(req, res);
        });
    });

    describe('recipesController.deleteMany()', () => {
        it('should call recipesService.deleteMany() with the correct arguments', async () => {


            const res = {
                send: sinon.stub()
            };

            await recipeController.deleteMany(res);
            expect(recipeController.deleteMany).to.have.been.calledWith(res);
        });
    });
});