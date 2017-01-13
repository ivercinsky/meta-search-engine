var request = require('request-promise');
var despegarURI = "https://api.despegar.com/v3/flights"
var cities = require("./cities.json");
var countries = require("./countries.json");

var despegarRequest = request.defaults({
    headers : {
        'X-ApiKey' : process.env.DESPEGAR_API,
        'Accept': 'application/json',
    }
});


var distanciaHamming = function(dna1, dna2) { 

  var mismatches = 0;

  for (var i = 0; i <= dna1.length; i++) {
    if (dna1[i] != dna2[i]) {//if character not equals
      mismatches ++;
    }
  }

  return mismatches;

}

const levenshtein = (a, b) => {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  let tmp, i, j, prev, val
  // swap to save some memory O(min(a,b)) instead of O(a)
  if (a.length > b.length) {
    tmp = a
    a = b
    b = tmp
  }

  row = Array(a.length + 1)
  // init the row
  for (i = 0; i <= a.length; i++) {
    row[i] = i
  }

  // fill in the rest
  for (i = 1; i <= b.length; i++) {
    prev = i
    for (j = 1; j <= a.length; j++) {
      if (b[i-1] === a[j-1]) {
        val = row[j-1] // match
      } else {
        val = Math.min(row[j-1] + 1, // substitution
              Math.min(prev + 1,     // insertion
                       row[j] + 1))  // deletion
      }
      row[j - 1] = prev
      prev = val
    }
    row[a.length] = prev
  }
  return row[a.length]
}


var formatearDesc = function(desc) {
    var desc = desc.replace(/á/g, "a");
    desc = desc.replace(/é/g, "e");
    desc = desc.replace(/í/g, "i");
    desc = desc.replace(/ó/g, "o");
    desc = desc.replace(/ú/g, "u");
    desc = desc.toUpperCase();
    return desc;
}

var checkDescription = function(country) {
    var desc = country.descriptions.es;
    var desc = formatearDesc(desc);
    var thisDesc = formatearDesc(this);
    return levenshtein(desc, thisDesc) < 2;
}
var checkDescriptionAndCountryId = function(city) {
    var desc = city.descriptions.es;
    var desc = formatearDesc(desc);
    var thisDesc = formatearDesc(this.desc);
    var countryId = city.country_id;
    return countryId == this.country_id && levenshtein(desc, thisDesc) < 2;
}

var lookCityCode = function(cityDesc, countryID) {
    return cities.items.find(checkDescriptionAndCountryId, {'desc' : cityDesc, 'country_id' : countryID}).code;
}

var lookCountryId = function(countryDesc) {
    return countries.items.find(checkDescription, countryDesc).id;
}


var buscarVuelos = function(paisorigen, origen, paisDestino, destino, desde, hasta, adultos, menores) {
    var method = '/itineraries';
    var PaisOrigenId = lookCountryId(paisorigen);
    console.log(PaisOrigenId);
    var PaisDestinoId = lookCountryId(paisDestino);
    console.log(PaisDestinoId);
    var FromcityCode = lookCityCode(origen, PaisOrigenId);
    var TocityCode = lookCityCode(destino, PaisDestinoId);
    console.log(FromcityCode);
    console.log(TocityCode);
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