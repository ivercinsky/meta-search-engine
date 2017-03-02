'use strict';

const Selector = require("./SearchEngineSelector.js");
const ResultsMerger = require("./ResultsMerger.js");
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const morgan = require('morgan');
const APIAI = require('./apiai.js');
//console.log(process.argv);
console.log("USANDO DESPEGAR_API_TOKEN", process.env.DESPEGAR_API_TOKEN, "para comunicarme con Despegar.com");

var app = express();

var jsonParser = bodyParser.json();


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(morgan('tiny'));
app.use(function (req, res, next) {
    res.setHeader('Content-type', 'application/json')
    next();
});
app.get('/favicon.ico', function (request, response) {
    response.send("hola");
});

//tener un archivo con las llamadas a api.ai
//tener un archivo con las llamadas a Despegar.


var printContexts = function(result) {
    result.contexts.forEach(function(context, index){
        console.log(context);
    });
}


var sessionsIds = new Map();

function sendBack(data, response) {
    console.log(data);
    printContexts(data.result);   
    response.send(data.result);

}

app.get('/chat', function (request, response) {
    console.log(request.query);
    var msg = request.query.chat || '';
    APIAI.query(msg, 1).then(function (data) {
        sendBack(data, response);
    });
});
app.get("/getEvent", function (request, response) {
    var event = request.query.event || '';
    var profile = {
        name : "Ivan",
        lastname : "Vercinsky"
    };
    APIAI.queryWithEvent(event, profile, 1).then(function (data) {
        sendBack(data, response);
    });
});

//CALL HECHO DESDE SKYPEBOT
//ME MANDA EL MENSAJE DESDE SKYPE Y EL SESSION ID.
app.post('/chat', function(request, response){

    //SIEMPRE CALL A APIAI QUERY...LUEGO SWITCH POR INTENT...
    
    var msg = request.body.msg;//corregir...
    var id = request.body.sessionId;
    if(!sessionsIds.has(id)) {
        //crear perfil.
        APIAI.queryWithEvent("CREAR_PERFIL", {}, id).then(function(data) {
            sendBack(data, response);
        });
    }
    var profile = sessionsIds.get(id);
    APIAI.queryWithEvent("SALUDAR_USER", profile, id).then(function(data){
        sendBack(data, response);
    });
});


app.post('/buscar_vuelos', function(request, response) {
    var req = request.body.result;
    var params = req.parameters;
    Selector.search(params).then(function(data){
        var vuelos = ResultsMerger.merge(data);
        response.send(vuelos);
    });
})
app.post('/', function (request, response) {
    var req = request.body.result;
    console.log("Recibi llamada con action", request.body.result.action);
    if (req.action == "buscar_vuelos") {
        if (!sessionsIds.has(request.body.sessionId)) {
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
            source: "MetaSearchEngine",
            sessionId: sessionsIds.get(request.body.sessionId)
        })
    } else if (req.action == "mostrar_resultados") {
        console.log("Enviando Resultados");
        var params = req.parameters;
        var resultados = JSON.parse(params.search);
        return response.send({
            speech: "Esto es lo que encontré",
            displayText: "Esto es lo que encontré",
            data: { "search": resultados },
            contextOut: [],
            source: "Resultados",
            sessionId: sessionsIds.get(request.body.sessionId)
        });
    } else {
        console.log("No entro en ninga action");
        //console.log(request.body.result);   
    }

});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port', process.env.PORT || 3000, '!');
});
