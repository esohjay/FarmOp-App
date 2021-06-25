const express = require("express");

const router = express.Router({ mergeParams: true });

const cropIncome = require("../models/cropIncome");
const Crop = require("../models/crop");
const { isLoggedin, validateIncome } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.post(
  "/",
  isLoggedin,
  validateIncome,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const crop = await Crop.findById(id);
    const income = new cropIncome(req.body.income);
    income.creator = req.user._id
    crop.inflow.push(income);
    await income.save();
    await crop.save();
    res.redirect(`/crop/${crop._id}`);
  })
);

router.delete(
  "/:incomeId",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id, incomeId } = req.params;
    await Crop.findByIdAndUpdate(id, { $pull: { inflow: incomeId } });
    await cropIncome.findByIdAndDelete(incomeId);
    req.flash("success", "Deleted successfully");
    res.redirect(`/crop/${id}`);
  })
);

module.exports = router;
