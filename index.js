const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Business = require('./models/business')
const Review = require('./models/review')
const axios = require('axios')
const { restroomSchema, reviewSchema } = require('./schemas')
const catchAsync = require('./utilities/catchAsync')
const ExpressError = require('./utilities/expressErrors')


mongoose.connect('mongodb://localhost:27017/spotless')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database Connected')
})
const app = express()
const path = require('path')


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateRestroom = (req, res, next) => {

    const { error } = restroomSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

app.get('/home', (req, res) => {
    res.render('home')
})
app.get('/restrooms', catchAsync(async (req, res, next) => {
    const restrooms = await Business.find({});
    res.render('restrooms/index', { restrooms })
}))

app.get('/restrooms/new', (req, res) => {
    res.render('restrooms/new')
})

app.post('/restrooms', validateRestroom, catchAsync(async (req, res, next) => { //logic to create a new bathroom

    const restroom = new Business(req.body.restroom);
    await restroom.save();
    res.redirect(`/restrooms/${restroom._id}`)
}))

app.get('/restrooms/:id', catchAsync(async (req, res, next) => {
    const restroom = await Business.findById(req.params.id).populate('reviews');
    console.log(restroom)
    res.render('restrooms/show', { restroom })
}))

app.get('/restrooms/:id/edit', catchAsync(async (req, res, next) => {
    const restroom = await Business.findById(req.params.id)
    res.render('restrooms/edit', { restroom })
}))

app.put('/restrooms/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params
    const restroom = await Business.findByIdAndUpdate(id, { ...req.body.restroom })
    res.redirect(`/restrooms/${restroom._id}`)
}))

app.delete('/restrooms/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Business.findByIdAndDelete(id);
    res.redirect('/restrooms')
}))

app.post('/restrooms/:id/reviews', validateReview, catchAsync(async (req, res, next) => {
    const business = await Business.findById(req.params.id);
    const review = new Review(req.body.review);
    business.reviews.push(review);
    await review.save()
    await business.save()
    res.redirect(`/restrooms/${business._id}`)

}))

app.delete('/restrooms/:id/reviews/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Business.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/restrooms/${id}`)
}))

// app.get('/addBusiness', async (req, res) =>{
//     const business = new Business({
//         name: 'Starbucks',
//     description: 'Busy area and needed to ask for code to unlock',
//     isGenderNuetral: true,
//     cleanlinessRating: 2.5,
//     location: '1234 Look here Blvd',
//     })
// await business.save()
// res.send(business)
// })

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err
    if (!err.message) err.message = 'Oh no! Something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})