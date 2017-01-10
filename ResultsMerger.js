module.exports = {
    merge: function(list) {
        if (list === undefined) {
            return []
        } else {
            if (typeof(list) == 'string') {
                return list;
            } else {
                return list[0];
            }
        }
    }
}