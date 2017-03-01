const request = require('request-promise');

var apiaiReq = request.defaults({
    headers: {
        'Authorization': 'Bearer ' + process.env.APIAI_TOKEN,
    },
    method: 'POST',
    uri: 'https://api.api.ai/v1/query?v=20150910'
});


const query = function (msg, id) {
    var options = {
        body: {
            query: [
                msg
            ],
            timezone: 'Argentina/Buenos_Aires',
            lang: 'es',
            sessionId: id
        },
        json: true // Automatically stringifies the body to JSON
    };
    return apiaiReq.post(options);
}

const queryWithEvent = function (event, data, id) {
    var options = {
       body: {
            event: {
                name: event,
                data: {
                    data : data
                }
            },
            lang: 'es',
            sessionId: id
        },
        json: true // Automatically stringifies the body to JSON
    };
    return apiaiReq.post(options);
}

module.exports = {
    query: query,
    queryWithEvent : queryWithEvent
}