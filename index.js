import dotenv from 'dotenv';
/* if(process.env.NODE_ENV !== 'production'){} */
dotenv.config();
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
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import User from "./models/user.js";
// Routes
import users from "./routes/users.js";
import areas from "./routes/areas.js";
import reviews from "./routes/reviews.js";

const app = express();
const port = process.env.PORT || 3000; // Define a port to run the project.

const uri = process.env.MDB_URL;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
/* db.on('error', err => { console.error.bind(console, "connection error: " + err.message) }); */
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {console.log("Database connected");});

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
/*app.use(express.static('/build/css'));*/

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoSanitize());
/* ({
    allowDots: true,
    replaceWith: '_',
}) */
app.use(
    session({
        secret: process.env.CK_SECRET,
        saveUninitialized: false, // don't create session until something stored
        resave: false, //don't save session if unmodified
        store: MongoStore.create({
        mongoUrl: `${process.env.MDB_URL}`,
        touchAfter: 24 * 3600, // time period in seconds
        }),
    })
);
/* app.set('trust proxy', 1) */
const sessionConfig = {
    name: "CookieMonster",
    secret: process.env.CK_SECRET,
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
app.use(helmet());
const scriptSrcUrls = [
  "https://getbootstrap.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
  "https://getbootstrap.com/",
  "https://cdn.jsdelivr.net/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/ddqiasrsz/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
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
});
// Set the error handler 'next'
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', { err });
    /* res.send("Ow boy, something went wrong"); */
});

app.listen(port);
