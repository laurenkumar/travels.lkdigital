var mongoose = require('mongoose');
var countrySchema = new mongoose.Schema({
    name: String,
    /*number: Number,*/
    latitude: String,
    longitude: String,
    /*types: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type'
        }
    ]*/
});

var Country = mongoose.model('Country', countrySchema);

module.exports = Country;