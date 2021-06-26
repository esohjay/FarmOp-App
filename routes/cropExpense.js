const express = require("express");

const router = express.Router({ mergeParams: true });

const cropExpense = require("../models/cropExpense");
const Crop = require("../models/crop");
const { isLoggedin, isAnAdmin, validateExpense } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.post(
  "/",
  isLoggedin, isAnAdmin,
  validateExpense,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const crop = await Crop.findById(id);
    const expense = new cropExpense(req.body.expense);
    expense.creator = req.user._id
    crop.expenses.push(expense);
    await expense.save();
    await crop.save();
    res.redirect(`/crop/${crop._id}`);
  })
);

router.delete(
  "/:expenseId",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id, expenseId } = req.params;
    await Crop.findByIdAndUpdate(id, { $pull: { expenses: expenseId } });
    await cropExpense.findByIdAndDelete(expenseId);
    req.flash("success", "Deleted successfully");
    res.redirect(`/crop/${id}`);
  })
);

module.exports = router;
