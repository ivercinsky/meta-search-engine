'use strict';

const Selector = require("./SearchEngineSelector.js");
const ResultsMerger = require("./ResultsMerger.js");
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');

//console.log(process.argv);
console.log("USANDO DESPEGAR_API_TOKEN", process.env.DESPEGAR_API_TOKEN, "para comunicarme con Despegar.com");

var app = express();

var jsonParser = bodyParser.json();


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function (req, res, next) {
    res.setHeader('Content-type', 'application/json')
    next();
});
app.get('/favicon.ico', function (request, response) {
    response.send("hola");

});

var apiaiReq = request.defaults({
    headers: {
        'Authorization': 'Bearer ' + process.env.APIAI_TOKEN,
    }
});

var skypeBot = request.defaults({

})

var sessionsIds = new Map();

app.post('/', function (request, response) {
    var req = request.body.result;
    console.log("Recibi llamada con action", request.body.result.action);
    if (req.action == "buscar_vuelos") {
        if(!sessionsIds.has(request.body.sessionId)) {
            sessionsIds.set(request.body.sessionId, request.body.sessionId);
        }
        var params = req.parameters;
        Selector.search(params).then(function (data) {
            var search = ResultsMerger.merge(data);
            // LLAMADA A API.AI CON EL EVENTO DE MOSTRAR RESULTADOS Y ESTE DATA..
            var options = {
                method: 'POST',
                uri: 'https://api.api.ai/api/query?v=20150910',
                body: {
                    event: {
                        name: process.env.RESULTADOS_EVENT_NAME,
                        data: {
                            search: search
                        }
                    },
                    lang: 'es',
                    sessionId: sessionsIds.get(request.body.sessionId)
                },
                json: true // Automatically stringifies the body to JSON
            };
            console.log("llamando a APIAI con resultados");
            apiaiReq.post(options).then(function (resp) {
                console.log(resp);
            });

        });
        return response.send({
            speech: "Buscando vuelos...",
            displayText: "Buscando vuelos...",
            data: {},
            contextOut: [],
            source: "MetaSearchEngine"
        })
    } else if (req.action == "mostrar_resultados") {
        console.log("Enviando Resultados");
        var params = req.parameters;
        var resultados = JSON.parse(params.search);
        return response.send({
            speech: "Esto es lo que encontré",
            displayText: "Esto es lo que encontré",
            data : {"search":resultados},
            contextOut : [],
            source: "Resultados",
            sessionId: sessionsIds.get(request.body.sessionId)
        });
    } else {
        console.log("No entro en ninga action");
        //console.log(request.body.result);   
    }

});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port0', process.env.PORT || 3000, '!');
});
