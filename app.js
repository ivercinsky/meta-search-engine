var Selector = require("./SearchEngineSelector.js");
var ResultsMerger = require("./ResultsMerger.js");
var dummyResponse = require("./dummyResponse.json");
const Hapi = require('hapi');

//console.log(process.argv);
console.log("USANDO API_KEY", process.env.DESPEGAR_API, "para comunicarme con Despegar.com"); 

const server = new Hapi.Server();
server.connection({ 
    host: process.env.HOST || 'localhost', 
    port: process.env.PORT || 8000 
});


server.route([{
    method:'GET',
    path:'/',
    handler: function(request, reply) {
        reply("Corriengo Ok", process.env.WEBSITE_NODE_DEFAULT_VERSION);
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
},{
    method:'POST',
    path:'/{p*}',
    handler: function(request, reply) {
        var req = request.payload.result;
        var params = req.parameters;
        console.log(params);
        
        //var speech = "Buscando vuelos para " + params.toC + ", " + params.to + " volando el " + params['departure-date'] + " y regresando el " + params['return-date'] + " para " + params.adultos + " adultos y " + params.children + " menores.";  
        Selector.search(params).then(function(response) {
            var speech = ResultsMerger.merge(response);
            var data = {
                speech: dummyResponse,
                displayText: "conexion exitosa --> " + JSON.stringify(params),
                data: {},
                contextOut:[],
                source:"MetaSearchEngine"
            }
            return reply(data).header('Content-type','application/json');
        }, function(error) {
            var speech = error
            var data = {
                speech: speech,
                displayText: "conexion exitosa --> " + JSON.stringify(params),
                data: {},
                contextOut:[],
                source:"MetaSearchEngine"
            }
            return reply(data).header('Content-type','application/json');
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