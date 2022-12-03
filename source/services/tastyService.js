const axios = require("axios");

const options = {
    method: 'GET',
    url: 'https://tasty.p.rapidapi.com/recipes/list',
    params: {from: '0', size: '20'},
    headers: {
        'x-rapidapi-key': '55b6edc232msh4c0b8ad01e13789p1a484djsn1b052ac5d787',
        'x-rapidapi-host': 'tasty.p.rapidapi.com'
    }
};

const getTastyRecipes = async function() {
    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    })
}
console.log(getTastyRecipes());

module.exports = {
    "getTastyRecipes": getTastyRecipes
}
