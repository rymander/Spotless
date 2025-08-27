const Joi = require('joi')
module.exports.restroomSchema = Joi.object({
    restroom: Joi.object({
        name: Joi.string().required(),
        cleanlinessRating: Joi.number().integer().min(1).max(4).required(),
        location: Joi.string().required(),
        imageURL: Joi.string().required(),
        description: Joi.string().required(),
    }).required()

})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().integer().min(1).max(4).required()
    }).required()
})