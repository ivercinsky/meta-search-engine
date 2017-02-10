'use strict';

const Selector = require("./SearchEngineSelector.js");
const ResultsMerger = require("./ResultsMerger.js");
const express = require('express');
const bodyParser = require('body-parser');

//console.log(process.argv);
console.log("USANDO DESPEGAR_API_TOKEN", process.env.DESPEGAR_API_TOKEN, "para comunicarme con Despegar.com"); 

var app = express();

var jsonParser = bodyParser.json();


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function(req, res, next) {
  res.setHeader('Content-type', 'application/json')
  next();
});
app.get('/favicon.ico',function(request, response) {
        response.send("hola");
    
});
app.post('/', function(request, response) {
    var req = request.body.result;
    if (req.action == "buscar_vuelos") {
        var params = req.parameters;
        response.send({
            speech: "Buscando vuelos...",
            displayText: "Buscando vuelos...",
            data: {},
            contextOut:[],
            source:"MetaSearchEngine"
        })
        Selector.search(params).then(function(response) {
            var search = ResultsMerger.merge(response);
            // LLAMADA A API.AI CON EL EVENTO DE MOSTRAR RESULTADOS Y ESTE DATA..
            /**var data = {
                speech: "Estos son los resueltados que encontre!",
                displayText: "conexion exitosa --> " + JSON.stringify(params),
                data: { "search": search},
                contextOut:[],
                source:"MetaSearchEngine"
            }
            return response.send(data).header('Content-type','application/json');*/
        });
    } else {
        console.log(request.body.result);
    }
    
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port0', process.env.PORT || 3000, '!');
});
