/* const express = require('express'); // CommonJS */
import express from "express";
import path from "path";
import methodOverride from "method-override";
import catchAsync from "./utils/catchAsync.js";
import ExpressError from "./utils/ExpressError.js";
import ejsMate from "ejs-mate";
import {areaSchema} from "./utils/joiSchemas.js";
const app = express();
const port = 3000; // Define a port to run the project.

const validateArea = (req, res, next) => {
    const { error } = areaSchema.validate(req.body);
    if( error ){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}



import Groundwork from "./models/groundwork.js";

import mongoose from "mongoose";
const uri = "mongodb+srv://root:0147@cluster-01.iozhzud.mongodb.net/places";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
/* db.on('error', err => { console.error.bind(console, "connection error: " + err.message) }); */
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* // CSS OWN STYLES
app.use(express.static('/build/css'));
*/

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("home");
});
app.get(
    "/areas",
    catchAsync(async (req, res) => {
        const areas = await Groundwork.find({});
        res.render("areas/index", { areas });
    })
);
app.get(
    "/areas/new",
    catchAsync(async (req, res) => {
        res.render("areas/new");
    })
);
// Post to make our new area
app.post(
    "/areas",
    validateArea,
    catchAsync(async (req, res, next) => {
        /* if(!req.body.area) throw new ExpressError("Invalid Area Data", 400); */
        const area = new Groundwork(req.body.area);
        await area.save();
        res.redirect(`/areas/${area._id}`);
    })
);

app.get(
    "/areas/:id",
    catchAsync(async (req, res) => {
        const area = await Groundwork.findById(req.params.id);
        res.render("areas/show", { area });
    })
);
app.get(
    "/areas/:id/edit",
    catchAsync(async (req, res) => {
        const area = await Groundwork.findById(req.params.id);
        res.render("areas/edit", { area });
    })
);
app.put(
    "/areas/:id",
    validateArea,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const area = await Groundwork.findByIdAndUpdate(id, { ...req.body.area });
        res.redirect(`/areas/${area._id}`);
    })
);
app.delete(
    "/areas/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Groundwork.findByIdAndDelete(id);
        res.redirect("/areas");
    })
);
// For every path '*'
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})
// Set the error handler 'next'
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', { err });
    /* res.send("Ow boy, something went wrong"); */
});

app.listen(port);
