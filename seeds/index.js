import mongoose from 'mongoose';
import cities from '../seeds/cities.js';
import { places, descriptors } from '../seeds/seedHelpers.js';
import Groundwork from '../models/groundwork.js';

const uri = 'mongodb+srv://vesselbit:0147@cluster-01.iozhzud.mongodb.net/ctrlchief';
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
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const ground = new Groundwork({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${(sample(places))}`
        })
        await ground.save();
    }
    /* const c = new Groundwork({ title: 'purple field'});
    await c.save(); */
}
seedDB().then(() => {
    mongoose.connection.close();
});
