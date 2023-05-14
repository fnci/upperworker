import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.js";
import passport from "passport";
import storeReturnTo from '../utils/storeReturnTo.js'

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res, next) => {

    try {
        const { username, email, password } = req.body;
        const newUser = new User({username, email});
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome UpperWorker!');
            res.redirect('/areas');
        })

    } catch (error) {

        req.flash('error', error.message);
        res.redirect('/register');

    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

//the storeReturnTo middleware function before passport.authenticate().

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Hey! Welcome back! :)');
    const redirectUrl = res.locals.returnTo || '/areas';
    /* delete req.session.returnTo; */
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Until next time!');
        res.redirect('/areas');
    });
});


export default router;