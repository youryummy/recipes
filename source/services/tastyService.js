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

        for (var i in response.data.results) {
            console.log('Receta '+i+':')
            console.log('Nombre: '+response.data.results[i].name);
            console.log('Descripcion: '+((response.data.results[i].description == '' || response.data.results[i].description == null) ? ('No hay descripcion') :
                (response.data.results[i].description.replace(/<[^>]*>/g,"").replace("\n",""))));
            console.log('Duracion: '+((response.data.results[i].total_time_minutes == '' || response.data.results[i].total_time_minutes == null) ? (0) : (response.data.results[i].total_time_minutes)) +' min.');
            console.log('Instrucciones:')
            if(response.data.results[i].instructions==null||response.data.results[i].instructions.length==0)
                console.log('No hay instrucciones');
            else
                for (var j in response.data.results[i].instructions) {

                    console.log('Paso '+(j)+': ')
                    console.log(response.data.results[i].instructions[j].display_text);
                    console.log('')
                }

            console.log('Etiquetas: ')
            if(response.data.results[i].topics==null||response.data.results[i].topics.length==0)
                console.log('No hay etiquetas');
            else
                for (var k in response.data.results[i].topics) {
                    console.log(response.data.results[i].topics[k].name);

                }
            console.log('-------------------------')
        }


    }).catch(function (error) {
        console.error(error);
    })
}
console.log(getTastyRecipes());

module.exports = {
    "getTastyRecipes": getTastyRecipes
}
