var request = require('request-promise');
var LocationCtrl = require('./LocationController.js');

var despegarURI = "https://api.despegar.com/v3/flights"

var despegarRequest = request.defaults({
    headers : {
        'X-ApiKey' : process.env.DESPEGAR_API_TOKEN,
        'Accept': 'application/json',
    }
});

var buscarVuelos = function(paisorigen, origen, paisDestino, destino, desde, hasta, adultos, menores) {
    var method = '/itineraries';
    /*var PaisOrigenId = lookCountryId(paisorigen);
    console.log(PaisOrigenId);
    var PaisDestinoId = lookCountryId(paisDestino);
    console.log(PaisDestinoId);
    var FromcityCode = lookCityCode(origen, PaisOrigenId);
    var TocityCode = lookCityCode(destino, PaisDestinoId);
    */
    var FromcityCode = LocationCtrl.findCityCode(paisorigen, origen);
    var TocityCode = LocationCtrl.findCityCode(paisDestino, destino);
    var query = "?site=ar&from="+FromcityCode+"&to="+TocityCode+"&departure_date="+desde+"&return_date="+hasta+"&adults="+adultos+"&children="+menores+"&limit=5";
    var url = despegarURI + method + query;
    return despegarRequest.get(url);
}

module.exports = {
    search : function(query, callback) {
        return buscarVuelos(query.fromC, query.from, query.toC, query.to, query.date, query.returnDate, query.adults, 0);
        //return extractor.extract(buscarVuelos(query.to, query.from, query.date, query.returnDate, query.adults, 0));
    }
}