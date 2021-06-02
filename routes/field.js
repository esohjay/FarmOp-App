const express = require("express");

const router = express.Router();

const Field = require("../models/field");
const { isLoggedin, validateField } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const options = {
      page: req.query.page || 1,
      limit: 15,
      sort: { name: -1 },
    };
    const fields = await Field.paginate({}, options);
    res.render("field/index", { fields });
  })
);
router.get("/new", isLoggedin, (req, res) => {
  res.render("field/new");
});
router.post(
  "/",
  isLoggedin,
  validateField,
  catchAsync(async (req, res) => {
    const field = new Field(req.body.field);
    await field.save();
    res.redirect("/field");
  })
);
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const field = await Field.findById(id);
    res.render("field/show", { field });
  })
);
router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const field = await Field.findById(id);
    res.render("field/edit", { field });
  })
);
router.put(
  "/:id",
  isLoggedin,
  validateField,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const field = await Field.findByIdAndUpdate(id, { ...req.body.field });
    await field.save();
    res.redirect(`/field/${field._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const field = await Field.findByIdAndDelete(id);
    res.redirect("/field");
  })
);

module.exports = router;
