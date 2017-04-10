var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resourcesSchema = new Schema({
    name: String,
    rm: String,
    shown: Boolean
},{strict: false, collection:'resources'});

module.exports = mongoose.model('Resource', resourcesSchema);
