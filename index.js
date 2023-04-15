/* const express = require('express'); // CommonJS */
import  express from 'express';
import path from 'path';
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


app.get("/", (req, res) => {
    res.render('home');
});

app.get('/makegroundwork', async(req, res) => {
    const ground = new Groundwork({
        title: "New Ground",
        description: "First work zone"
    });
    await ground.save();
    res.send(ground);
});

app.listen(port);