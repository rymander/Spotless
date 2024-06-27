
const mongoose = require('mongoose')
const cities = require('./cities')
const {places} = require('./seedHelpers')
const Business = require('../models/business');
const business = require('../models/business');
const axios = require('axios')

mongoose.connect('mongodb://localhost:27017/spotless')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', ()=> {
    console.log('Database Connected')
})

const sample = array => array[Math.floor(Math.random()* array.length)]

  // call unsplash and return small image
  async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'M8KdFMUPg8AWMqruL7fk8WHbBXLkSmnvY9ZzOxAFq10',
          collections: 2468201,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }

const seedDB = async () => {
    await Business.deleteMany({})
    
    for(let i = 0; i < 20; i++){
        const random1000 = Math.floor(Math.random() * 1000);
       const bus =  new Business({
            imageURL: await seedImg(),
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(places)}`,
            description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',

        })
        await bus.save()
    }
}

seedDB().then(()=> {
    mongoose.connection.close()
})