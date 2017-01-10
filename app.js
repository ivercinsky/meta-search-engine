var Selector = require("./SearchEngineSelector.js");
var ResultsMerger = require("./ResultsMerger.js");

var busqueda = function(query) {
    return ResultsMerger.merge(Selector.search(query));
}

//console.log(process.argv);
console.log(busqueda(JSON.parse(process.argv[2].split("=")[1])));