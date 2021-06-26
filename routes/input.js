const express = require("express");
const router = express.Router({ mergeParams: true });
const Input = require("../models/input");
const { isLoggedin, searchAndFilter, sortDlisplay, validateInput, isAnAdmin } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Expense = require("../models/cropExpense");
const Crop = require("../models/crop");
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
      sort: { name: -1 },
    };
    

    const inputs = await Input.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    
    if (!inputs.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("input/index", { inputs });
  })
);

router.get("/new", isLoggedin, isAnAdmin, catchAsync(async (req, res) => {
  const crop = await Crop.find({creator: req.user._id})
  res.render("input/new", {
    inputType: "",
    name: "",
    date: "",
    inputName: "",
    quantity: "",
    cost: "",
    note: "", crop
  });
}));

//Create new treatment
router.post(
  "/",
  isLoggedin,
  validateInput,
  isAnAdmin,
  catchAsync(async (req, res) => {
    const input = new Input(req.body.input);
    input.creator = req.user._id
    await input.save();
    const expenses = new Expense({
        expense: input.inputName,
        date: input.date,
        amount: input.cost,
        name: input.name,
        note: `${input.quantity} of ${input.inputType} was used for this input`
    }) 
    expenses.creator = req.user._id
    await expenses.save()
    req.flash('success', 'Input recorded successfully')
    res.redirect(`/input/${input._id}`);
  })
);
router.get(
  "/:id",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const input = await Input.findById(id)
    
    if (!input) {
      req.flash("error", "No input found");
      return res.redirect("/input");
    }
    res.render("input/show", { input});
  })
);
router.get(
  "/:id/edit",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const input = await Input.findById(id);
    const date = changeDate(input.date)
     const crop = await Crop.find({creator: req.user._id})
    res.render("input/edit", { input, date, crop });
  })
);


router.put(
  "/:id",
  isLoggedin, validateInput,
  isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const input = await Input.findByIdAndUpdate(id, { ...req.body.input });
    await input.save();
    req.flash('success', 'Updated successfully')
    res.redirect(`/input/${input._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Input.findByIdAndDelete(id);
    req.flash('success', 'Deleted successfully')
    res.redirect("/input");
  })
);


module.exports = router;
