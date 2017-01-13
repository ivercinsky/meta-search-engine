var Selector = require("./SearchEngineSelector.js");
var ResultsMerger = require("./ResultsMerger.js");
const Hapi = require('hapi');

//console.log(process.argv);
console.log("USANDO API_KEY", process.env.DESPEGAR_API, "para comunicarme con Despegar.com"); 

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});


server.route([{
    method:'GET',
    path:'/',
    handler: function(request, reply) {
        reply("Corriengo Ok");
    }
},{
    method:'GET',
    path:'/favicon.ico',
    handler: function(request, reply) {
        reply("hola");
    }
},{
    method: 'GET',
    path:'/{p*}', 
    handler: function (request, reply) {
        //var query = JSON.parse(process.argv[2].split("=")[1]);
        var query = request.query;
        console.log(request.path);
        Selector.search(query, request.path).then(function(response) {
            response = ResultsMerger.merge(response);
            reply(response);
        });
    }
}]);

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});