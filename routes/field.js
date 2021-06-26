const express = require("express");

const router = express.Router();

const Field = require("../models/field");
const Crop = require("../models/crop");
const { isLoggedin, validateField, isAnAdmin, searchAndFilter, sortDlisplay } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get(
  "/", isLoggedin, searchAndFilter, sortDlisplay,
  catchAsync(async (req, res) => {
    const options = {
      page: req.query.page || 1,
      limit: 20,
      sort: { name: -1 },
    };
    const { dbQuery, dbOption } = res.locals;

    delete res.locals.dbQuery;
    delete res.locals.dbOption;

    const fields = await Field.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    if (!fields.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("field/index", { fields });
  })
);
router.get("/new", isLoggedin, isAnAdmin, (req, res) => {
  res.render("field/new");
});
router.post(
  "/",
  isLoggedin, isAnAdmin,
  validateField,
  catchAsync(async (req, res) => {
    const field = new Field(req.body.field);
    field.creator = req.user._id
    await field.save();
    res.redirect("/field");
  })
);
router.get(
  "/:id", isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const field = await Field.findById(id);
     const crops = await Crop.find({creator: req.user.farmId, field: field.name})
        
        if (!field) {
      req.flash("error", "No field found");
      return res.redirect("/field");
    }
    res.render("field/show", { field, crops });
  })
);
router.get(
  "/:id/edit",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const field = await Field.findById(id);
    res.render("field/edit", { field });
  })
);
router.put(
  "/:id",
  isLoggedin, isAnAdmin,
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
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const field = await Field.findByIdAndDelete(id);
    res.redirect("/field");
  })
);

module.exports = router;
