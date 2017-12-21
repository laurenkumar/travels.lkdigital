var mongoose = require('mongoose');
var adminSchema = new mongoose.Schema({
    /*name: String,
    number: Number,
    description: String,*/
    picture: String,
    /*types: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type'
        }
    ]*/
});

var Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;