const express = require("express");

const router = express.Router();

const Farmstock = require("../models/farmstock");
const Animal = require("../models/animal");
const { isLoggedin, validateField, searchAndFilter, sortDlisplay } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get(
  "/", searchAndFilter, sortDlisplay,
  catchAsync(async (req, res) => {
    const options = {
      page: req.query.page || 1,
      limit: 20,
      sort: { name: -1 },
    };
    const { dbQuery, dbOption } = res.locals;

    delete res.locals.dbQuery;
    delete res.locals.dbOption;

    const farmstocks = await Farmstock.find({});
    const farmstockIds = []
    for (let farmstock of farmstocks){
        farmstockIds.push(farmstock._id)
    }
    
    res.render("field/index", { farmstockIds });
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
     const crops = await Crop.find()
        .where("field")
        .all(field.name)
        .limit(5)
        .exec();
        if (!field) {
      req.flash("error", "No field found");
      return res.redirect("/field");
    }
    res.render("field/show", { field, crops });
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
