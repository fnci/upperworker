/* const express = require('express'); // CommonJS */
import  express from 'express';
import path from 'path';
import methodOverride from 'method-override';
const app = express();
const port = 3000; // Define a port to run the project.

import Groundwork from './models/groundwork.js';

import mongoose from 'mongoose';
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


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get("/", (req, res) => {
    res.render('home');
});
app.get("/areas", async (req, res) => {
    const areas = await Groundwork.find({});
    res.render('areas/index', { areas });
});
app.get("/areas/new", async (req, res) => {
    res.render('areas/new');
});
app.post("/areas", async (req, res) => {
    const area = new Groundwork(req.body.area);
    await area.save();
    res.redirect(`/areas/${area._id}`)
});

app.get("/areas/:id", async (req, res) => {
    const area = await Groundwork.findById(req.params.id);
    res.render('areas/show', { area });
});
app.get('/areas/:id/edit', async (req, res) => {
    const area = await Groundwork.findById(req.params.id);
    res.render('areas/edit', { area });
});
app.put('/areas/:id', async (req, res) => {
    const { id } = req.params;
    const area = await Groundwork.findByIdAndUpdate( id, {...req.body.area} );
    res.redirect(`/areas/${area._id}`)
});
app.delete('/areas/:id', async (req, res) =>{
    const { id } = req.params;
    await Groundwork.findByIdAndDelete(id);
    res.redirect('/areas');
})

app.listen(port);