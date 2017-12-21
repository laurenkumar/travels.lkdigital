var mongoose = require('mongoose');
var photosSchema = new mongoose.Schema({
    name: String,
    /*number: Number,*/
    description: String,
    picture: String,
    /*types: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type'
        }
    ]*/
});

var Photos = mongoose.model('Photos', photosSchema);

module.exports = Photos;