const express = require("express");

const router = express.Router({ mergeParams: true });
const Crop = require("../models/crop");
const cropExpense = require("../models/cropExpense");
const {
  isLoggedin,
  validateExpense,
  searchAndFilter,isAnAdmin,
  sortDlisplay,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const changeDate = require("../utils/changeDate")

router.get(
  "/",
  isLoggedin,
  searchAndFilter,
  sortDlisplay,
  catchAsync(async (req, res) => {
    const { dbQuery, dbOption } = res.locals;

    delete res.locals.dbQuery;
    delete res.locals.dbOption;
    const options = {
      page: req.query.page || 1,
      limit: 20,
      sort: { createdAt: -1 },
    };
    let names = [];
    const expenses = await cropExpense.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    for (let result of expenses.docs) {
      names.push(result.name);
    }
    if (!expenses.docs.length && res.locals.query) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    return res.render("cropexpense/index", { expenses, names });
  })
);
router.get(
  "/new",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const crop = await Crop.find({creator: req.user._id});
    res.render("cropexpense/new", { crop });
  })
);
router.post(
  "/",
  isLoggedin,
  validateExpense, isAnAdmin,
  catchAsync(async (req, res) => {
    const expense = new cropExpense(req.body.expense);
    expense.creator = req.user._id
    await expense.save();

    res.redirect(`/cropexpense/${expense._id}`);
  })
);
router.get(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const expense = await cropExpense.findById(id);
    if (!expense) {
      req.flash("error", "No record found");
      return res.redirect("/expense");
    }
    res.render("cropexpense/show", { expense });
  })
);

router.get(
  "/:id/edit",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const expense = await cropExpense.findById(id);
    const crop = await Crop.find({creator: req.user._id});
    const date = changeDate(expense.date)
    res.render("cropexpense/edit", { expense, crop, date });
  })
);

router.put(
  "/:id",
  isLoggedin, isAnAdmin,
  validateExpense,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const expense = await cropExpense.findByIdAndUpdate(id, {
      ...req.body.expense,
    });
    await expense.save();
    res.redirect(`/cropexpense/${expense._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    await cropExpense.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully");
    res.redirect(`/cropexpense`);
  })
);

module.exports = router;
