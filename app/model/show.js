var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var ShowSchema = new Schema({
    title: String,
    release_year: Number,
    synopsis: String,
    _id: String
});

module.exports = mongoose.model('Show', ShowSchema);
/*
/show/${id} when given the appropriate id, will yield the show matching that identifier.
The above endpoints should contain, at minimum, the title, release year, and a synopsis of the media item being displayed.

*/