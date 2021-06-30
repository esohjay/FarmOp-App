const express = require("express");

const router = express.Router({ mergeParams: true });

const cropIncome = require("../models/cropIncome");
const Crop = require("../models/crop");

const {
  isLoggedin,
  validateIncome,
  searchAndFilter, isAnAdmin,
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
      limit: 100,
      sort: { createdAt: -1 },
    };
    let names = [];
    const inflow = await cropIncome.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    for (let result of inflow.docs) {
      names.push(result.name);
    }
    if (!inflow.docs.length && res.locals.dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("cropinflow/index", { inflow, names });
  })
);
router.get(
  "/new",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const crop = await Crop.find({creator: req.user._id});
    res.render("cropinflow/new", { crop });
  })
);
router.post(
  "/",
  isLoggedin, isAnAdmin,
  validateIncome,
  catchAsync(async (req, res) => {
    const income = new cropIncome(req.body.income);
    income.creator = req.user._id
    await income.save();
    res.redirect(`/cropinflow/${income._id}`);
  })
);
router.get(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const income = await cropIncome.findById(id);
    if (!income) {
      req.flash("error", "No record found");
      return res.redirect("/income");
    }
    res.render("cropinflow/show", { income });
  })
);
router.get(
  "/:id/edit",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const income = await cropIncome.findById(id);
    const crop = await Crop.find({creator: req.user._id});
    const date = changeDate(income.date)
    res.render("cropinflow/edit", { income, crop, date });
  })
);
router.put(
  "/:id",
  isLoggedin, isAnAdmin,
  validateIncome,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const income = await cropIncome.findByIdAndUpdate(id, {
      ...req.body.income,
    });
    await income.save();
    res.redirect(`/cropinflow/${income._id}`);
  })
);
router.delete(
  "/:id", isAnAdmin,
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await cropIncome.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully");
    res.redirect(`/cropinflow`);
  })
);

module.exports = router;
