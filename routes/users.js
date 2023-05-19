import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";
import storeReturnTo from "../utils/storeReturnTo.js"
import {renderRegister, register, renderLogin, login, logout} from "../controllers/userController.js"


router.route('/register')
.get(renderRegister)
.post(catchAsync(register));
router.route('/login')
.get(renderLogin)
.post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), login);
router.get('/logout', logout);


export default router;