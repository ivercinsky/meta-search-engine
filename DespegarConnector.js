module.exports = {
    search : function(query) {
        return "Buscando vuelos para " + query.to + " desde " + query.from + " para el dia " + query.date + " volviendo el dia " + query.returnDate + " para " + query.adults + " adultos.";
    }
}