'use strict';

const Selector = require("./SearchEngineSelector.js");
const ResultsMerger = require("./ResultsMerger.js");
const Hapi = require('hapi');

//console.log(process.argv);
console.log("USANDO DESPEGAR_API_TOKEN", process.env.DESPEGAR_API_TOKEN, "para comunicarme con Despegar.com"); 

const server = new Hapi.Server();

server.connection({ 
    host: process.env.HOST || 'localhost', 
    port: process.env.PORT || 8000 
});


server.register(require('inert'), function() {
    server.route({
        method:'GET',
        path:'/',
        handler: function(request, reply) {
            reply.file("./index.html");
        }
    });
});

server.route([{
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
}, {
    method:'POST',
    path:'/vuelos',
    handler: function(request, reply) {
        console.log("Buscando VUELOs");
        console.log(request);
        var req = request.payload.result;
        var params = req.parameters;
        console.log(params);
        
        Selector.search(params).then(function(response) {
            var search = ResultsMerger.merge(response);
            var data = {
                speech: "Estos son los resueltados que encontre!",
                displayText: "conexion exitosa --> " + JSON.stringify(params),
                data: { "search": search},
                contextOut:[],
                source:"MetaSearchEngine"
            }
            return reply(data).header('Content-type','application/json');
        });
    }
}, {
    method: 'POST',
    path: '/',
    handler: function(request, reply) {
        console.log("ENTRO SIN ACTION");
        return reply("NO MANDO EL ACTION").header('Content-type','application/json');
    }
}]);

const options = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ ops: '*' }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'good-file',
            args: ['./test/fixtures/awesome_log']
        }],
        myHTTPReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ error: '*' }]
        }, {
            module: 'good-http',
            args: ['http://prod.logs:3000', {
                wreck: {
                    headers: { 'x-api-key': 12345 }
                }
            }]
        }]
    }
};

server.register({
    register: require('good'),
    options,
}, (err) => {

    if (err) {
        return console.error(err);
    }
    server.start(() => {
        console.info(`Server started at ${ server.info.uri }`);
    });

});


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});