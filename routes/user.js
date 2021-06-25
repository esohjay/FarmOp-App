const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const {
  validateUser,
  isAnAdmin,
  isLoggedin,
  isValidPassword,
  changePassword,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Task = require("../models/task");
const Event = require("../models/event");
const Sales = require("../models/income");
const cropEvent = require("../models/cropEvent");
const cropTask = require("../models/cropTask");
const cropIncome = require("../models/cropIncome");
const Mortality = require("../models/mortality");
const util = require("util");
const crypto = require('crypto');

const oauth2Client = new OAuth2(
     process.env.CLIENT_ID, // ClientID
      process.env.CLIENT_SECRET, // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
);
oauth2Client.setCredentials({
     refresh_token: process.env.REFRESH_TOKEN,
});
const accessToken = oauth2Client.getAccessToken()
router.get("/register",  (req, res) => {
  res.render("user/register", {
    username: "",
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPW: "",
  });
});
router.post(
  "/register",
  validateUser,
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, lname, fname, confirmPW, phone, password } =
        req.body;

      const user = new User({
        email,
        username,
        confirmPW,
        lname,
        fname,
        phone,
      });
      
      //user.isAdmin = true;
      const registerdUser = await User.register(user, password);
      
     const uId = registerdUser._id
      if(req.user){
        await User.findByIdAndUpdate(uId,{$set: {farmId: req.user._id}})
     
        req.flash("success", `${registerdUser.fname} has been successfully registered`);
        res.redirect(`/user/profile/${req.user._id}`)
        
      }else{
        
      await User.findByIdAndUpdate(uId,{$set: {farmId: uId, isAdmin: true}})
     
         req.login(registerdUser, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcome ${user.username}`);
        res.redirect("/");
      });
      }
     
    } catch (e) {
      const { username, fname, lname, email, phone, password, confirmPW } =
        req.body;
      let error = e.message;
      if (
        error.includes("duplicate") &&
        error.includes("index: email_1 dup key")
      ) {
        req.flash("error", "A user with the given email address already exist");
        error = "A user with the given email address already exist";
        //res.redirect('/animal/new' , {name , batch, category, breed, quantity, source, description })
        res.render("user/register", {
          username,
          error,
          fname,
          lname,
          email,
          phone,
          password,
          confirmPW,
        });
      }

      req.flash("error", `${error}`);
      res.render("user/register", {
        username,
        error,
        fname,
        lname,
        email,
        phone,
        password,
        confirmPW,
      });
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }),
  catchAsync(async (req, res) => {
    const { username } = req.body;
    req.flash("success", `Welcome back ${username}`);
    const redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  })
);




router.get("/forgot",  (req, res) => {
  res.render("user/forgot");
});
router.put('/forgot', catchAsync(async (req,res) => {
const token = await crypto.randomBytes(20).toString('hex');
	
	const user = await User.findOne({ email: req.body.email })
	if (!user) {
    req.flash('error', 'No account with that email address exists.')
	
	  return res.redirect('/forgot-password');
	}

	user.resetPasswordToken = token;
	user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  const smtpTransport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user:  process.env.EMAIL, 
          clientId:  process.env.CLIENT_ID,
          clientSecret:  process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken
     },tls: {
  rejectUnauthorized: false
}
});

const msg = {
    to: user.email,
    from: process.env.EMAIL,
    subject: 'FarmOp - Forgot Password / Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			Please click on the following link, or copy and paste it into your browser to complete the process:
			http://${req.headers.host}/user/reset-password/${token}
			If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/			/g, ''),
  };
await smtpTransport.sendMail(msg, (error, response) => {
     error ? console.log(error) : console.log(response);
     smtpTransport.close();
});
req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
  res.redirect('/user/forgot');

})
 
);

router.get('/reset-password/:token', catchAsync(async(req, res) => {
  const { token } = req.params;
	const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired.')
   
    return res.redirect('/user/forgot');
  }
  res.render('user/reset', { token });
}))

router.put('/reset-password/:token', catchAsync(async(req, res) => {
  const { token } = req.params;
	const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
	
	if (!user) {
	  req.flash('error', 'Password reset token is invalid or has expired.');
	 return res.redirect(`/user/reset/${ token }`);
	}

	if(req.body.password === req.body.confirm) {
		await user.setPassword(req.body.password);
		user.resetPasswordToken = null;
		user.resetPasswordExpires = null;
		await user.save();
		const login = util.promisify(req.login.bind(req));
		await login(user);
	} else {
		 req.flash('error', 'Password do not match.');
		return res.redirect(`/user/reset/${ token }`);
	}

  const smtpTransport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user:  process.env.EMAIL, 
          clientId:  process.env.CLIENT_ID,
          clientSecret:  process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken
     },tls: {
  rejectUnauthorized: false
}
});

const msg = {
    to: user.email,
    from: process.env.EMAIL,
    subject: 'FarmOp - Password Changed',
    text: `Hello,
	  	This email is to confirm that the password for your account has just been changed.
	  	If you did not make this change, please hit reply and notify us at once.`.replace(/	  	/g, '')
  };
await smtpTransport.sendMail(msg, (error, response) => {
     error ? console.log(error) : console.log(response);
     smtpTransport.close();
});
req.flash('success', `Your password has been successfully changed.`);
  res.redirect(`/user/profile/${user._id}`);

}))




router.get(
  "/profile/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id)

    if (user.isAdmin === true) {
      const tasks = await Task.find({creator: req.user.farmId}).limit(5).exec();
      const cTasks = await cropTask.find({creator: req.user.farmId}).limit(5).exec();
      const cEvents = await cropEvent.find({creator: req.user.farmId}).limit(5).exec();
      const cIncome = await cropIncome.find({creator: req.user.farmId}).limit(5).exec();
      const events = await Event.find({creator: req.user.farmId}).limit(5).exec();
      const sales = await Sales.find({creator: req.user.farmId}).limit(5).exec();
      const mortality = await Mortality.find({creator: req.user.farmId}).limit(10).exec();
      res.render("user/profile", {
        tasks,
        events,
        sales,
        mortality,
        cTasks,
        cEvents,
        cIncome,
      });
    } else {
      const tasks = await Task.find({creator: req.user.farmId})
        .where("workers")
        .all(user.fname)
        .limit(5)
        .exec();
      const cTasks = await cropTask
        .find({creator: req.user.farmId})
        .where("workers")
        .all(user.fname)
        .limit(5)
        .exec();
      const cEvents = await cropEvent.find({creator: req.user.farmId}).limit(5).exec();
      const events = await Event.find({creator: req.user.farmId}).limit(5).exec();
      if (!user) {
      req.flash("error", "No user found");
      return res.redirect("/user/login");
    }
      res.render("user/profile", { tasks, events, cTasks, cEvents });
    }
  })
);

router.get("/update-profile", isLoggedin, (req, res) => {
  res.render("user/edit");
});
router.put(
  "/update-profile",
  isLoggedin,
  isValidPassword,
  changePassword,

  catchAsync(async (req, res) => {
    // destructure username and email from req.body
    const { username, email, fname, lname, phone } = req.body;
    // destructure user object from res.locals
    const { user } = res.locals;
    // check if username or email need to be updated
    if (username) user.username = username;
    if (email) user.email = email;
    if (fname) user.fname = fname;
    if (lname) user.lname = lname;
    if (phone) user.phone = phone;
    // save the updated user to the database
    await user.save();
    // promsify req.login
    const login = util.promisify(req.login.bind(req));
    // log the user back in with new info
    await login(user);
    // redirect to /profile with a success flash message
    req.flash("success", "Profile updated Successfully");
    res.redirect(`/user/profile/${user.id}`);
  })
);

router.get('/', isLoggedin, isAnAdmin, catchAsync(async (req, res) => {
  const users = await User.find({farmId: req.user.farmId});
  if (!users) {
      req.flash("error", "No user found");
      return res.redirect("/user/login");
    }
  res.render('user/staff', {users})
}))

router.get('/profile/:id/edit', isLoggedin, isAnAdmin, catchAsync(async (req, res) => {
  const {id} = req.params;
  const user = await User.findById(id);
  res.render('user/staffEdit', {user})
}))

router.put('/setrole/:id', isLoggedin, isAnAdmin, catchAsync(async (req, res) => {
  const {id} = req.params;
  const user = await User.findByIdAndUpdate(id,{...req.body.user});
  await user.save();
  req.flash('success', `Role for ${user.fname} has been set`);
  res.redirect('/user')
}))

router.delete(
  "/:id",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    req.flash("success", `${user.fname} ${user.lname} has been removed successfully`);
    res.redirect("/user");
  })
);

router.get(
  "/logout",
  catchAsync((req, res) => {
    req.logout();
    req.flash("success", "Goodbye");
    res.redirect("/");
  })
);
module.exports = router;
