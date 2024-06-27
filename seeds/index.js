
const mongoose = require('mongoose')
const cities = require('./cities')
const {places} = require('./seedHelpers')
const Business = require('../models/business');
const business = require('../models/business');


mongoose.connect('mongodb://localhost:27017/spotless')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', ()=> {
    console.log('Database Connected')
})

const sample = array => array[Math.floor(Math.random()* array.length)]

const seedDB = async () => {
    await Business.deleteMany({})
    for(let i = 0; i < 20; i++){
        const random1000 = Math.floor(Math.random() * 1000);
       const bus =  new Business({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(places)}`

        })
        await bus.save()
    }
}

seedDB().then(()=> {
    mongoose.connection.close()
})