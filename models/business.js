const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;


const BusinessSchema = new Schema({
    name: String,
    description: String,
    isGenderNuetral: Boolean,
    cleanlinessRating: Number,
    location: String,
    imageURL: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],

});

BusinessSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Business', BusinessSchema)
