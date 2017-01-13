
var DespegarConnector = require("./DespegarConnector.js");

function SelectSearchEngine(query) {
    // TODO aplicar un regular expression al query para saber si 
    // esta buscando vuelos, hoteles, taxis, restaurants.
    return DespegarConnector.search(query);
}


module.exports = {
    search : function(query, action) {
        return SelectSearchEngine(query, action);
    }
}