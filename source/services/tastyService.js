const axios = require("axios");
var Recipe = require("../models/recipe")

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
    axios.request(options).then(async function (response) {

        for (var i in response.data.results) {
            let name = response.data.results[i].name;
            let summary = (response.data.results[i].description == '' || response.data.results[i].description == null) ? ('No hay descripcion') :
                (response.data.results[i].description.replace(/<[^>]*>/g,"").replace("\n",""));
            let duration = ((response.data.results[i].total_time_minutes == '' || response.data.results[i].total_time_minutes == null) ? (0) : (response.data.results[i].total_time_minutes));
            let steps = [];
            if(response.data.results[i].instructions==null||response.data.results[i].instructions.length==0)
                steps.push('No hay instrucciones');
            else
                for (var j in response.data.results[i].instructions) {
                    steps.push(response.data.results[i].instructions[j].display_text);
                }

            let tags = [];
            if(response.data.results[i].topics==null||response.data.results[i].topics.length==0)
                tags.push('No hay etiquetas');
            else
                for (var k in response.data.results[i].topics) {
                    tags.push(response.data.results[i].topics[k].name);
                }
            const recipe = new Recipe({
                name,
                summary,
                duration,
                steps,
                tags
            });

            await recipe.save();

        }


    }).catch(function (error) {
        console.error(error);
    })
}


module.exports = {
    "getTastyRecipes": getTastyRecipes
}
