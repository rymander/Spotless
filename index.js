const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Business = require('./models/business')


mongoose.connect('mongodb://localhost:27017/spotless')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', ()=> {
    console.log('Database Connected')
})
const app = express()
const path = require('path')


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


app.get('/home', (req, res) =>{
    res.render('home')
})
app.get('/restrooms', async (req, res) =>{
    const restrooms = await Business.find({});
    res.render('restrooms/index', { restrooms })
})

app.get('/restrooms/new', (req, res)=>{
    res.render('restrooms/new')
})

app.post('/restrooms', async(req, res)=> { //logic to create a new bathroom
    const restroom = new Business(req.body.restroom);
    await restroom.save();
    res.redirect(`/restrooms/${restroom._id}`)
})

app.get('/restrooms/:id', async(req, res,) => {
    const restroom = await Business.findById(req.params.id)
    res.render('restrooms/show', { restroom })
})

app.get('/restrooms/:id/edit', async(req, res,) => {
    const restroom = await Business.findById(req.params.id)
    res.render('restrooms/edit', { restroom })
})

app.put('/restrooms/:id', async(req, res)=> {
    const { id } = req.params
    const restroom = await Business.findByIdAndUpdate(id, {...req.body.restroom})
    res.redirect(`/restrooms/${restroom._id}`)
})

app.delete('/restrooms/:id', async(req, res) => {
    const { id } = req.params;
    await Business.findByIdAndDelete(id);
    res.redirect('/restrooms')
})

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

app.listen(3000, ()=> {
    console.log('Servinging on port 3000')
})