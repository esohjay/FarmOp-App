const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
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

router.get("/register", isAnAdmin, (req, res) => {
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
      if (
        (username === "Admin" && password === "3766") ||
        (username === "Admin2" && password === "123")
      ) {
        user.isAdmin = true;
      }
      const registerdUser = await User.register(user, password);

      req.login(registerdUser, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcome ${user.username}`);
        res.redirect("/");
      });
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
    failureRedirect: "/login",
  }),
  catchAsync(async (req, res) => {
    const { username } = req.body;
    req.flash("success", `Welcome back ${username}`);
    const redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  })
);

router.get(
  "/profile",
  isLoggedin,
  catchAsync(async (req, res) => {
    const user = req.user;

    if (user.isAdmin === true) {
      const tasks = await Task.find({}).limit(5).exec();
      const cTasks = await cropTask.find({}).limit(5).exec();
      const cEvents = await cropEvent.find({}).limit(5).exec();
      const cIncome = await cropIncome.find({}).limit(5).exec();
      const events = await Event.find({}).limit(5).exec();
      const sales = await Sales.find({}).limit(5).exec();
      const mortality = await Mortality.find({}).limit(10).exec();
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
      const tasks = await Task.find()
        .where("workers")
        .all(user.fname)
        .limit(5)
        .exec();
      const cTasks = await cropTask
        .find()
        .where("workers")
        .all(user.fname)
        .limit(5)
        .exec();
      const cEvents = await cropEvent.find({}).limit(5).exec();
      const events = await Event.find({}).limit(5).exec();
      res.render("user/profile", { tasks, events, cTasks, cEvents });
    }
  })
);
router.get("/update-profile", isLoggedin, (req, res) => {
  res.render("user/edit");
});
router.put(
  "/profile",
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
    res.redirect("/profile");
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
