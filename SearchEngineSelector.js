
var DespegarConnector = require("./DespegarConnector.js");

function SelectSearchEngine(query,action) {
    // TODO aplicar un regular expression al query para saber si 
    // esta buscando vuelos, hoteles, taxis, restaurants.
    console.log(action);
    switch(action) {
            case('/vuelos') : return DespegarConnector.search(query);
            case('/ciudades') : return "";
            case('/paises') : return "";
    }
}


module.exports = {
    search : function(query, action) {
        return SelectSearchEngine(query, action);
    }
}