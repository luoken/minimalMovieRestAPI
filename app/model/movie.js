var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    title: String,
    release_year: Number,
    synopsis: String,
    _id: String
});

module.exports = mongoose.model('Movie', MovieSchema);