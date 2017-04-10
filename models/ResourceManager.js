var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resourceManagerSchema = new Schema({
    name: String,
    email: String,
    resources: [Schema.Types.Mixed]
}, {strict: false, collection: 'resourceManagers'});

module.exports = mongoose.model('ResourceManager', resourceManagerSchema);
