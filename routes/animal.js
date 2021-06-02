const express = require("express");
const router = express.Router();
const Animal = require("../models/animal");
const User = require("../models/user");
const {
  isLoggedin,
  validateLivestock,
  searchAndFilter,
  sortDlisplay,
  validateLivestockEdit,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get(
  "/",
  searchAndFilter,
  sortDlisplay,
  catchAsync(async (req, res) => {
    const { dbQuery, dbOption } = res.locals;

    delete res.locals.dbQuery;
    delete res.locals.dbOption;
    const options = {
      page: req.query.page || 1,
      limit: 15,
      sort: { createdAt: -1 },
    };
    let names = [];
    let categories = [];

    let batch = [];
    let breed = [];

    const animals = await Animal.paginate(dbQuery, dbOption || options);
    for (let result of animals.docs) {
      names.push(result.name);

      batch.push(result.batch);
      breed.push(result.breed);

      categories.push(result.category);
    }
    if (!animals.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("animal/index", { animals, names, categories, breed, batch });
  })
);

router.get("/new", isLoggedin, (req, res) => {
  //let field = {name : '', batch : '', category: '', breed: '', quantity:'', source: '', description:''}
  res.render("animal/new", {
    name: "",
    date: "",
    batch: "",
    category: "",
    breed: "",
    quantity: "",
    source: "",
    description: "",
  });
});

router.post(
  "/",
  isLoggedin,
  validateLivestock,
  catchAsync(async (req, res) => {
    try {
      const animal = new Animal(req.body.animal);
      await animal.save();
      res.redirect(`/animal/${animal._id}`);
    } catch (err) {
      const {
        name,
        batch,
        category,
        breed,
        quantity,
        source,
        date,
        description,
      } = req.body.animal;
      let error = err.message;
      if (
        error.includes("duplicate") &&
        error.includes("index: batch_1 dup key")
      ) {
        req.flash("error", "Batch Number already exist");
        error = "Batch Number already exist";
        //res.redirect('/animal/new' , {name , batch, category, breed, quantity, source, description })
        res.render("animal/new", {
          name,
          date,
          error,
          batch,
          category,
          breed,
          quantity,
          source,
          description,
        });
      }
    }
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findById(id)
      .populate("events")
      .populate("tasks")
      .populate("weight")
      .populate("farmstock")
      .populate("feed")
      .populate("egg")
      .populate("inflow")
      .populate("expenses")
      .populate("mortality");
    const staff = await User.find({});
    res.render("animal/show", { animal, staff });
  })
);

router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findById(id);
    res.render("animal/edit", { animal });
  })
);

router.put(
  "/:id",
  isLoggedin,
  validateLivestock,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findByIdAndUpdate(id, { ...req.body.animal });

    await animal.save();
    res.redirect(`/animal/${animal._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findByIdAndDelete(id);

    req.flash("success", "Animal deleted successfully");
    res.redirect("/animal");
  })
);

module.exports = router;
