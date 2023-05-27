import mongoose from 'mongoose';
import cities from '../seeds/cities.js';
import { places, descriptors } from '../seeds/seedHelpers.js';
import Groundwork from '../models/groundwork.js';

const uri = 'mongodb+srv://root:0147@cluster-01.iozhzud.mongodb.net/places';
mongoose.connect( uri , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
/* db.on('error', err => { console.error.bind(console, "connection error: " + err.message) }); */
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Groundwork.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = random1000 * 1000;
        const ground = new Groundwork({
            author: '6462f91d4b7f262340eba1cf',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${(sample(places))}`,
            image: 'https://source.unsplash.com/collection/1708724',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime saepe vero dolore labore hic, itaque dicta aperiam adipisci ratione corporis ad, ab fuga quasi libero officia expedita quaerat eos? Labore?',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/ddqiasrsz/image/upload/v1684992136/upperworker/y22dz63dc88wzpq1t5cy.jpg',
                  filename: 'upperworker/y22dz63dc88wzpq1t5cy',
                },
                {
                  url: 'https://res.cloudinary.com/ddqiasrsz/image/upload/v1684992190/upperworker/qkog5fudyctgvxanstky.jpg',
                  filename: 'upperworker/qkog5fudyctgvxanstky',
                },
                {
                  url: 'https://res.cloudinary.com/ddqiasrsz/image/upload/v1684992195/upperworker/bmfcjw0w5x6aihzwjed3.jpg',
                  filename: 'upperworker/bmfcjw0w5x6aihzwjed3',
                }
            ]
        })
        await ground.save();
    }
    /* const c = new Groundwork({ title: 'purple field'});
    await c.save(); */
}
seedDB().then(() => {
    mongoose.connection.close();
});
