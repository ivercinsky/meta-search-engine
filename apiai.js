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
    console.log("llamando a APIAI", msg, id);
    return apiaiReq.post(options);
    /*apiaiReq.post(options).then(function (resp) {
        console.log(resp);
    });*/
}

const queryWithEvent = function (event, id) {
    var myprofile = {
        name : "Ivan",
        lastname : "Vercinsky"
    }
    var options = {
       body: {
            event: {
                name: event,
                data: {
                    profile : myprofile
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