var mongoose = require('mongoose');
require('mongoose-moment')(mongoose);
var Schema = mongoose.Schema;

var doorUserSchema = new Schema({
    name: String,
    date: 'Moment',
    date2: 'Moment',
    resources: [Schema.Types.Mixed]
}, {strict: false, collection: 'doorusers'});

module.exports = mongoose.model('DoorUser',doorUserSchema);
