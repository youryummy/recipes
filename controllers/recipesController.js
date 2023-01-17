import * as service from '../services/recipesService.js';

export function getRecipes(req, res) {
    service.get(req, res);
}

export function createRecipe(req, res) {
    service.post(req, res);
}

export function findRecipe(req, res) {
    service.getById(req, res);
}

export function editRecipe(req, res) {
    service.update(req, res);
}

export function deleteRecipe(req, res) {
    service.remove(req, res);
}