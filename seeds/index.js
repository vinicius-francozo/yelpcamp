const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const {Campgrounds, Users} = require('../models')

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 20) + 10
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = await Campgrounds.create({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            Images: [
                {
                    url: 'https://res.cloudinary.com/dwbwmfpvj/image/upload/v1709224514/cld-sample-2.jpg',
                    filename: 'cld-sample-2'
                }
            ],
            description: 'Lorem ipsum dolor sit',
            price
        }, {
            include: [{
                association: Campgrounds.Images
            }]
        })
        const author = await Users.findByPk(1)
        camp.setAuthor(author)
    }
}

seedDB()
