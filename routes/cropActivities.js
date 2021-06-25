const express = require("express");

const router = express.Router();

const User = require("../models/user");
const Crop = require("../models/crop");

const cropEvent = require("../models/cropEvent");
const {
  isLoggedin,
  validateEvent,
  searchAndFilter,
  sortDlisplay,
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
      limit: 15,
      sort: { createdAt: -1 },
    };
    let names = [];
    let cropEvents = [];

    const events = await cropEvent.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    for (let result of events.docs) {
      names.push(result.name);
      cropEvents.push(result.event);
    }

    if (!events.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("cropevent/index", { events, names, cropEvents });
  })
);
router.get(
  "/new",
  isLoggedin,
  catchAsync(async (req, res) => {
    const user = await User.find({farmId: req.user._id});
    const crop = await Crop.find({creator: req.user._id});
    res.render("cropevent/new", { user, crop });
  })
);

router.post(
  "/",
  isLoggedin,
  validateEvent,
  catchAsync(async (req, res) => {
    const event = new cropEvent(req.body.event);
    event.creator = req.user._id
    await event.save();
    res.redirect(`/cropevent/${event._id}`);
  })
);

router.get(
  "/:id", isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const event = await cropEvent.findById(id);
    if (!event) {
      req.flash("error", "No record found");
      return res.redirect("/event");
    }
    res.render("cropevent/show", { event });
  })
);
router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const event = await cropEvent.findById(id);
    const user = await User.find({farmId: req.user._id});
    const crop = await Crop.find({creator: req.user._id});
    const eventDate = changeDate(event.date)
    res.render("cropevent/edit", { event, user, crop, eventDate });
  })
);
router.put(
  "/:id",
  isLoggedin,
  validateEvent,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const event = await cropEvent.findByIdAndUpdate(id, { ...req.body.event });
    await event.save();
    res.redirect(`/cropevent/${event._id}`);
  })
);

router.delete(
  "/:eventId",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { eventId } = req.params;

    await cropEvent.findByIdAndDelete(eventId);
    req.flash("success", "Deleted successfully");
    res.redirect(`/event`);
  })
);

module.exports = router;
