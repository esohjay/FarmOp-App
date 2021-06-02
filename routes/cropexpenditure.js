const express = require("express");

const router = express.Router({ mergeParams: true });
const Crop = require("../models/crop");
const cropExpense = require("../models/cropExpense");
const {
  isLoggedin,
  validateExpense,
  searchAndFilter,
  sortDlisplay,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

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
      limit: 100,
      sort: { createdAt: -1 },
    };
    let names = [];
    const expenses = await cropExpense.paginate(dbQuery, dbOption || options);
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
  isLoggedin,
  catchAsync(async (req, res) => {
    const crop = await Crop.find({});
    res.render("cropexpense/new", { crop });
  })
);
router.post(
  "/",
  isLoggedin,
  validateExpense,
  catchAsync(async (req, res) => {
    const expense = new cropExpense(req.body.expense);

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
    res.render("cropexpense/show", { expense });
  })
);

router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const expense = await cropExpense.findById(id);
    const crop = await Crop.find({});
    res.render("cropexpense/edit", { expense, crop });
  })
);

router.put(
  "/:id",
  isLoggedin,
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
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    await cropExpense.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully");
    res.redirect(`/cropexpense`);
  })
);

module.exports = router;
