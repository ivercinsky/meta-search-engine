var request = require('request-promise');
var despegarURI = "https://api.despegar.com/v3/flights"
var despegarRequest = request.defaults({
    headers : {
        'X-ApiKey' : process.env.DESPEGAR_API,
        'Accept': 'application/json',
    }
});

var buscarVuelos = function(origen, destino, desde, hasta, adultos, menores) {
    var method = '/itineraries';
    var query = "?site=ar&from="+origen+"&to="+destino+"&departure_date="+desde+"&return_date="+hasta+"&adults="+adultos+"&children="+menores;
    var url = despegarURI + method + query;
    return despegarRequest.get(url);
}

module.exports = {
    search : function(query, callback) {
        return buscarVuelos(query.to, query.from, query.date, query.returnDate, query.adults, 0);
        //return extractor.extract(buscarVuelos(query.to, query.from, query.date, query.returnDate, query.adults, 0));
    }
}