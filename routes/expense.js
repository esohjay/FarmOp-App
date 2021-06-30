const express = require("express");

const router = express.Router();

const Expense = require("../models/expense");

const {
  isLoggedin,
  validateExpense,
  searchAndFilter,
  sortDlisplay,
  isAnAdmin,
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
      limit: 100,
      sort: { createdAt: -1 },
    };

    let names = [];
    const expenses = await Expense.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    for (let result of expenses.docs) {
      names.push(result.name);
    }
    if (!expenses.docs.length && res.locals.dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("expense/index", { expenses, names });
  })
);
router.get("/new", isLoggedin, isAnAdmin, (req, res) => {
  res.render("expense/new");
});
router.post(
  "/",
  isLoggedin, isAnAdmin,
  validateExpense,
  catchAsync(async (req, res) => {
    const expense = new Expense(req.body.expense);
    expense.creator = req.user._id
    await expense.save();
    res.redirect(`/expense/${expense._id}`);
  })
);
router.get(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) {
      req.flash("error", "No record found");
      return res.redirect("/expense");
    }
    res.render("expense/show", { expense });
  })
);
router.get(
  "/:id/edit",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    const date = changeDate(expense.date)
    res.render("expense/edit", { expense, date });
  })
);
router.put(
  "/:id",
  isLoggedin, isAnAdmin,
  validateExpense,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findByIdAndUpdate(id, {
      ...req.body.expense,
    });
    await expense.save();
    res.redirect(`/expense/${expense._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    await Expense.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully");
    res.redirect(`/expense`);
  })
);

module.exports = router;
