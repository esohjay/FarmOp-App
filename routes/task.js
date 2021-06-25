const express = require("express");

const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const changeDate = require("../utils/changeDate")
const Event = require("../models/event");
const Task = require("../models/task");
const User = require("../models/user");
const {
  isLoggedin,
  validateTask,
  validateTaskEdit,
  searchAndFilter,
  sortDlisplay,
} = require("../middleware");

router.get(
  "/", isLoggedin,
  searchAndFilter,
  sortDlisplay,
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
    let animalTasks = [];

    const tasks = await Task.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    for (let result of tasks.docs) {
      names.push(result.name);
      animalTasks.push(result.task);
    }

    if (!tasks.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }

    res.render("task/index", { tasks, animalTasks, names });
  })
);
router.get(
  "/new",
  isLoggedin,
  catchAsync(async (req, res) => {
    const staff = await User.find({farmId: req.user._id});

    res.render("task/new", { staff });
  })
);
router.post(
  "/",
  isLoggedin,
  validateTask,
  catchAsync(async (req, res) => {
    const task = new Task(req.body.task);
    //task.workers = req.body.workers;
    task.creator = req.user._id
    await task.save();
    res.redirect(`/task/${task._id}`);
  })
);
router.get(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate("staff");
    const staff = await User.find({});
    if (!task) {
      req.flash("error", "No task found");
      return res.redirect("/task");
    }
    res.render("task/show", { task, staff });
  })
);
router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const staff = await User.find({farmId: req.user._id});
    const task = await Task.findById(id);
     const deadline = changeDate(task.deadline)
    const startDate = changeDate(task.startDate)
    res.render("task/edit", { task, staff, deadline, startDate });
  })
);

router.post(
  "/:id/complete", isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const foundTask = await Task.findById(id);
    const { name, leader, workers, task } = foundTask;
    const event = new Event({
      event: task,
      name: name,
      date: Date.now(),
      leader: leader,
      note: `This event was completed by ${workers}`,
    });

    await foundTask.delete(id);
    await event.save();
    res.redirect(`/event/${event._id}`);
  })
);
router.put(
  "/:id",
  isLoggedin,
  validateTask,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, { ...req.body.task });
    await task.save();
    res.redirect(`/task/${task._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    res.redirect("/task");
  })
);

module.exports = router;
