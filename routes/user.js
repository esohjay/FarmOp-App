const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const { validateUser} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');



router.get('/register', (req, res) => {
    res.render('user/register')
})
router.post('/register', validateUser, catchAsync( async(req, res, next) => {
    try{
     const {email, username, lname, fname, confirmPW, phone, password} = req.body;
     const user = new User({email, username, confirmPW, lname, fname, phone});
    const registerdUser = await User.register(user, password)
 req.login(registerdUser, err => {
     if (err) return next(err);
     req.flash('success', `Welcome ${user.username}`)
     res.redirect('/')
 })
   
 } catch (e){
 req.flash('error', e.message)
 res.redirect('/register')
    }
 }));

router.get('/login', (req, res) => {
    res.render('user/login')
})
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync( async (req, res) => {
    const {username} = req.body;
    req.flash('success', `Welcome back ${username}`)
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}));
router.get('/logout', catchAsync((req, res) => {
    req.logout()
    req.flash('success', 'Goodbye')
    res.redirect('/')
}));
module.exports = router;