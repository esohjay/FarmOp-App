const express = require("express");

const router = express.Router();

const Income = require("../models/income");

const {
  isLoggedin,
  validateIncome,
  searchAndFilter,
  sortDlisplay,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const changeDate = require("../utils/changeDate")
router.get(
  "/",
  searchAndFilter,
  isLoggedin,
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
    const inflow = await Income.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    for (let result of inflow.docs) {
      names.push(result.name);
    }
    if (!inflow.docs.length && res.locals.query) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("income/index", { inflow, names });
  })
);
router.get("/new", isLoggedin, (req, res) => {
  res.render("income/new");
});
router.post(
  "/",
  isLoggedin,
  validateIncome,
  catchAsync(async (req, res) => {
    const income = new Income(req.body.income);
    income.creator = req.user._id
    await income.save();
    res.redirect(`/income/${income._id}`);
  })
);

router.get(
  "/:id", isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const income = await Income.findById(id);
    if (!income) {
      req.flash("error", "No record found");
      return res.redirect("/income");
    }
    res.render("income/show", { income });
  })
);
router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const income = await Income.findById(id);
    const date = changeDate(income.date)
    res.render("income/edit", { income, date });
  })
);
router.put(
  "/:id",
  isLoggedin,
  validateIncome,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const income = await Income.findByIdAndUpdate(id, { ...req.body.income });
    await income.save();
    res.redirect(`/income/${income._id}`);
  })
);
router.delete(
  "/:incomeId",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    await Income.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully");
    res.redirect(`/income`);
  })
);

module.exports = router;
