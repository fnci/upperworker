/* const express = require('express'); // CommonJS */
import express from "express";
/* import { MongoClient } from "mongodb"; */
import path from "path";
// Mongoose
import mongoose from "mongoose";
import methodOverride from "method-override";
import ExpressError from "./utils/ExpressError.js";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";

import User from "./models/user.js";


// Routes
import users from "./routes/users.js";
import areas from "./routes/areas.js";
import reviews from "./routes/reviews.js";

const app = express();
const port = 3000; // Define a port to run the project.

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

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

/* app.set('trust proxy', 1) */
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    /*secure: true */
    cookie: {
        // By default, the httpOnly attribute is set.
        httpOnly: true,
        // The expires option should not be set directly; instead only use the maxAge option
        //  If both expires and maxAge are set in the options, then the last one defined in the object is what is used.
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // Force the session identifier cookie to be set on every response.
        /* rolling: true, */
        /* secure: true, */
    }
}
app.use(session(sessionConfig));
app.use(flash());

// This need to be after session
app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));
// How we can store the user in the session
passport.serializeUser(User.serializeUser());
// How we get the user out of the session
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    if(!['/login', '/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
// pbkdf2 hashing algorithm
/* app.get('/userproof', async (req, res) => {
    const user = new User({ email: 'franz7@email.com', username: 'franz7'});
    const newUser = await User.register(user, 'mypassport');
    res.send(newUser);
}) */


// Use routes
app.use("/", users);
app.use("/areas", areas);
app.use("/areas/:id/reviews", reviews);


app.get("/", (req, res) => {
    res.render("home");
});


// For every path '*'
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})
// Set the error handler 'next'
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', { err });
    /* res.send("Ow boy, something went wrong"); */
});

app.listen(port);
