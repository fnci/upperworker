import User from "../models/user.js";

const renderRegister = (req, res) => {
    res.render('users/register');
}

const register = async (req, res, next) => {
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
}

const renderLogin = (req, res) => {
    res.render('users/login');
}

const login = (req, res) => {
    req.flash('success', 'Hey! Welcome back! :)');
    const redirectUrl = res.locals.returnTo || '/areas';
    /* delete req.session.returnTo; */
    res.redirect(redirectUrl);
}
const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Until next time!');
        res.redirect('/areas');
    });
}

export {renderRegister, register, renderLogin, login, logout}