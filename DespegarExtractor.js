module.exports = {
    extract : function(body) {
        //console.log(body);
        var response = [];
        return JSON.stringify(body);
/*        var body = JSON.parse(body);
        body.items.forEach(function(item) {
            var data = {};
            data.id = item.id;
            data.outbound = item.outbound_choices[0];
            data.inbound = item.inbound_choices[0];
            data.price = item.price_detail;
            response.push(data);
        }, this);

        var htmlResponse = "<table>";
        response.forEach(function(data) {
            htmlResponse+="<tr>";
            htmlResponse+="<td>" + data.outbound.duration + "</td>";
            data.outbound.segments.forEach(function(segment) {
                htmlResponse+="<td>" + segment.from + "</td>";
                htmlResponse+="<td>" + segment.to + "</td>";
                htmlResponse+="<td>" + segment.duration + "</td>";
            }, this);

            htmlResponse+="<td>" + data.inbound.duration + "</td>";
            data.inbound.segments.forEach(function(segment) {
                htmlResponse+="<td>" + segment.from + "</td>";
                htmlResponse+="<td>" + segment.to + "</td>";
                htmlResponse+="<td>" + segment.duration + "</td>";
            }, this);

            
            htmlResponse+="<td>" + data.price.total + "</td>";
            htmlResponse+="</tr>";
        }, this);
        htmlResponse+="</table>";
        return htmlResponse;*/
    }
};