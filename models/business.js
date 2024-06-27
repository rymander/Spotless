const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
    name: String,
    description: String,
    isGenderNuetral: Boolean,
    cleanlinessRating: Number,
    location: String,
    imageURL: String,

});

module. exports = mongoose.model('Business', BusinessSchema)