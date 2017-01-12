var extractor = require('./DespegarExtractor.js');
module.exports = {
    merge: function(response) {
        return extractor.extract(response);
    },
}