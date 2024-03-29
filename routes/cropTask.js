const express = require("express");

const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const changeDate = require("../utils/changeDate")

const CTask = require("../models/cropTask");
const Event = require("../models/cropEvent");
const User = require("../models/user");
const Crop = require("../models/crop");
const {
  isLoggedin,
  validateTask,

  searchAndFilter,
  isAnAdmin,
} = require("../middleware");

router.get(
  "/",
  searchAndFilter,
  isLoggedin,
  catchAsync(async (req, res) => {
    const { dbQuery, dbOption } = res.locals;
    delete res.locals.dbQuery;
    delete res.locals.dbOption;
    const options = {
      page: req.query.page || 1,
      limit: 15,
      sort: { createdAt: -1 },
    };
    let names = [];
    let cropTasks = [];

    const tasks = await CTask.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    for (let result of tasks.docs) {
      names.push(result.name);
      cropTasks.push(result.task);
    }

    if (!tasks.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }

    res.render("cropTask/index", { tasks, names, cropTasks });
  })
);
router.get(
  "/new",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const staff = await User.find({farmId: req.user._id});
    const crop = await Crop.find({creator: req.user._id});

    res.render("cropTask/new", { staff, crop });
  })
);
router.post(
  "/",
  isLoggedin, isAnAdmin,
  validateTask,
  catchAsync(async (req, res) => {
    const task = new CTask(req.body.task);
    task.creator = req.user._id
    //task.workers = req.body.workers;
    await task.save();
    res.redirect(`/croptask/${task._id}`);
  })
);
router.get(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await CTask.findById(id)
    const staff = await User.find({farmId: req.user._id});
    if (!task) {
      req.flash("error", "No task found");
      return res.redirect("/croptask");
    }
    res.render("cropTask/show", { task, staff });
  })
);
router.get(
  "/:id/edit",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const staff = await User.find({farmId: req.user._id});
    const task = await CTask.findById(id);
     const crop = await Crop.find({creator: req.user._id});
    const deadline = changeDate(task.deadline)
    const startDate = changeDate(task.startDate)
    res.render("cropTask/edit", { task, staff, deadline, crop, startDate });
  })
);
router.post(
  "/:id/complete", isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const foundTask = await CTask.findById(id);
    const { name, leader, workers, creator, task } = foundTask;
    const event = new Event({
      event: task,
      name: name,
      date: Date.now(),
      leader: leader,
      creator: creator,
      note: `This event was completed by ${workers}`,
    });

    await foundTask.delete(id);
    await event.save();
    res.redirect(`/cropevent/${event._id}`);
  })
);
router.put(
  "/:id",
  isLoggedin, isAnAdmin,
  validateTask,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await CTask.findByIdAndUpdate(id, { ...req.body.task });
    await task.save();
    res.redirect(`/croptask/${task._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await CTask.findByIdAndDelete(id);
    res.redirect("/croptask");
  })
);

module.exports = router;
