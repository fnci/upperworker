import dotenv from 'dotenv';
/* if(process.env.NODE_ENV !== 'production'){} */
dotenv.config();
import mongoose from 'mongoose';
import cities from '../seeds/cities.js';
import { places, descriptors } from '../seeds/seedHelpers.js';
import Groundwork from '../models/groundwork.js';

const uri = process.env.MDB_URL;
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
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = random1000 * 1000;
        const ground = new Groundwork({
            author: '647d51f44da4d833a1c3ee29',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${(sample(places))}`,
            image: 'https://unsplash.com/collections/444603/artisan',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime saepe vero dolore labore hic, itaque dicta aperiam adipisci ratione corporis ad, ab fuga quasi libero officia expedita quaerat eos? Labore?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/ddqiasrsz/image/upload/v1688955582/upperworker/flower-planting_egldmu.jpg',
                    filename: 'upperworker/flower-planting_egldmu.jpg',
                },
                {
                    url: 'https://res.cloudinary.com/ddqiasrsz/image/upload/v1688954968/upperworker/Installing-floor_toowez.jpg',
                    filename: 'upperworker/Installing-floor_toowez.jpg',
                },
                {
                    url: 'https://res.cloudinary.com/ddqiasrsz/image/upload/v1685862634/upperworker/photo-1674077342248-9c6484a77034_k2hf1o.jpg',
                    filename: 'upperworker/photo-1674077342248-9c6484a77034_k2hf1o.jpg',
                },
                {
                    url: 'https://res.cloudinary.com/ddqiasrsz/image/upload/v1685863420/upperworker/photo-1628281321655-060c5fb662a5_p3hnjl.jpg',
                    filename: 'upperworker/photo-1628281321655-060c5fb662a5_p3hnjl.jpg',
                },
                {
                    url: 'https://res.cloudinary.com/ddqiasrsz/image/upload/v1688954972/upperworker/Spray-Painting_guaozi.jpg',
                    filename: 'upperworker/Spray-Painting_guaozi.jpg',
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
