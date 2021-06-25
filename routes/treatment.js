const express = require("express");
const router = express.Router({ mergeParams: true });
const Treatment = require("../models/treatment");
const { isLoggedin, searchAndFilter, sortDlisplay, validateTreatment } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Expense = require("../models/expense");
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
      limit: 20,
      sort: { name: -1 },
    };
    let names = [];
    let categories = [];
    let breed = [];

    const treatments = await Treatment.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    for (let result of treatments.docs) {
      names.push(result.name);

      breed.push(result.drug);

      categories.push(result.dose);
    }
    if (!treatments.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("treatment/index", { treatments, breed, names, categories });
  })
);

router.get("/new", isLoggedin, (req, res) => {
  res.render("treatment/new", {
    drug: "",
    name: "",
    date: "",
    treatmentName: "",
    dose: "",
    cost: "",
    note: "",
  });
});

//Create new treatment
router.post(
  "/",
  isLoggedin,
  validateTreatment,
  
  catchAsync(async (req, res) => {
    const treatment = new Treatment(req.body.treatment);
    await treatment.save();
    const expenses = new Expense({
        expense: treatment.treatmentName,
        date: treatment.date,
        amount: treatment.cost,
        name: treatment.name,
        note: `${treatment.dose} of ${treatment.drug} was used for this treatment`
    });
    treatment.creator = req.user._id;
    expenses.creator = req.user._id; 
    await expenses.save()
    req.flash('success', 'Treatment recorded successfully')
    res.redirect(`/treatment/${treatment._id}`);
  })
);
router.get(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const treatment = await Treatment.findById(id)
    
    if (!treatment) {
      req.flash("error", "No treatment found");
      return res.redirect("/treatment");
    }
    res.render("treatment/show", { treatment});
  })
);
router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const treatment = await Treatment.findById(id);
    const date = changeDate(treatment.date)
    res.render("treatment/edit", { treatment, date });
  })
);


router.put(
  "/:id",
  isLoggedin,
  validateTreatment,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const treatment = await Treatment.findByIdAndUpdate(id, { ...req.body.treatment });
    await treatment.save();
    req.flash('success', 'Updated successfully')
    res.redirect(`/treatment/${treatment._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Treatment.findByIdAndDelete(id);
    req.flash('success', 'Deleted successfully')
    res.redirect("/treatment");
  })
);


module.exports = router;
