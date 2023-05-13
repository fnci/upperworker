import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.js";
import passport from "passport";

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {

    try {
        const { username, email, password } = req.body;
        const newUser = new User({username, email});
        const registerUser = await User.register(newUser, password);

        req.flash('success', 'Welcome UpperWorker!');
        res.redirect('/areas');

    } catch (error) {

        req.flash('error', error.message);
        res.redirect('/register');

    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Hey! Welcome back! :)');
    res.redirect('/areas');
});

export default router;