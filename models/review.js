const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: {
        type: Number,
        min: 1,
        max: 4
    },


});

module.exports = mongoose.model('Review', ReviewSchema)