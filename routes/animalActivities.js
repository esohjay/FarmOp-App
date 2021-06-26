const express = require("express");

const router = express.Router();
const User = require("../models/user");

const Event = require("../models/event");
const {
  isLoggedin,
  validateEvent,
  searchAndFilter,
  sortDlisplay,isAnAdmin,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const changeDate = require("../utils/changeDate")

router.get(
  "/", isLoggedin,
  searchAndFilter,
  sortDlisplay,
  catchAsync(async (req, res) => {
    const { dbQuery, dbOption } = res.locals;
    delete res.locals.dbQuery;
    delete res.locals.dbOption;
    const options = {
      page: req.query.page || 1,
      limit: 10,
      sort: { createdAt: -1 },
    };
    let names = [];
    let animalEvents = [];

    const events = await Event.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    for (let result of events.docs) {
      names.push(result.name);
      animalEvents.push(result.event);
    }

    if (!events.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("event/index", { events, names, animalEvents });
  })
);
router.get(
  "/new",
  isLoggedin,isAnAdmin,
  catchAsync(async (req, res) => {
    const user = await User.find({farmId: req.user._id});
    res.render("event/new", { user });
  })
);

router.post(
  "/",
  isLoggedin,
  validateEvent,isAnAdmin,
  catchAsync(async (req, res) => {
    const event = new Event(req.body.event);
    event.creator = req.user._id
    await event.save();
    res.redirect(`/event/${event._id}`);
  })
);

router.get(
  "/:id", isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      req.flash("error", "No event found");
      return res.redirect("/event");
    }
    res.render("event/show", { event });
  })
);
router.get(
  "/:id/edit",
  isLoggedin,isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const staff = await User.find({farmId: req.user._id})
    const event = await Event.findById(id);
    const eventDate = changeDate(event.date)
    res.render("event/edit", { event, staff, eventDate });
  })
);
router.put(
  "/:id",
  isLoggedin,
  validateEvent,isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, { ...req.body.event });
    await event.save();
    res.redirect(`/event/${event._id}`);
  })
);
router.delete(
  "/:eventId",
  isLoggedin,isAnAdmin,
  catchAsync(async (req, res) => {
    const { eventId } = req.params;

    await Event.findByIdAndDelete(eventId);
    req.flash("success", "Deleted successfully");
    res.redirect(`/event`);
  })
);

module.exports = router;
