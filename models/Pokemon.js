var mongoose = require('mongoose');

var pokemonSchema = new mongoose.Schema({
    pays: String,
    name: String,
    number: Number,
    description: String,
    latitude: String,
    longitude: String,
    picture: String,
    picture2: String,
    picture3: String,
    types: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type'
        }
    ]
});

var Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;