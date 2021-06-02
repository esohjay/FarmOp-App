const express = require("express");
const router = express.Router({ mergeParams: true });
const Breeder = require("../models/breeder");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isLoggedin, searchAndFilter, sortDlisplay } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const farmstock = require("../models/farmstock");

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
      limit: 20,
      sort: { name: -1 },
    };
    let names = [];
    let categories = [];
    let breed = [];

    const breeder = await Breeder.paginate(dbQuery, dbOption || options);
    for (let result of breeder.docs) {
      names.push(result.name);

      breed.push(result.breed);

      categories.push(result.category);
    }
    if (!breeder.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("breeder/index", { breeder, breed, names, categories });
  })
);

router.get("/new", isLoggedin, (req, res) => {
  res.render("breeder/new", {
    tag: "",
    sex: "",
    category: "",
    breed: "",
    sire: "",
    dam: "",
    description: "",
  });
});

//Create new livestock
router.post(
  "/",
  isLoggedin,
  upload.single("image"),
  catchAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const breeder = new Breeder(req.body.breeder);
      const { path, filename } = req.file;
      breeder.image = { url: path, filename: filename };
      await breeder.save();
      res.redirect(`/breeder/${breeder._id}`);
    } catch (err) {
      const { tag, category, sire, name, dam, breed, sex, description } =
        req.body.breeder;
      let error = err.message;
      if (
        error.includes("duplicate") &&
        error.includes("index: tag_1 dup key")
      ) {
        req.flash("error", "Tag Number already exist");
        error = "Tag Number already exist";
        //res.redirect('/animal/new' , {name , batch, category, breed, quantity, source, description })
        res.render("breeder/new", {
          tag,
          category,
          name,
          error,
          sire,
          dam,
          breed,
          sex,
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

    const breeder = await Breeder.findById(id)
      .populate("breeding")
      .populate("farmstock");
    res.render("breeder/show", { breeder });
  })
);

router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const breeder = await Breeder.findById(id);
    res.render("breeder/edit", { breeder });
  })
);

router.put(
  "/:id",
  isLoggedin,
  upload.single("image"),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const breeder = await Breeder.findByIdAndUpdate(id, {
      ...req.body.breeder,
    });
    if (breeder.image && req.file) {
      try {
        await cloudinary.uploader.destroy(breeder.image.filename);
        const { path, filename } = req.file;
        breeder.image = { url: path, filename: filename };
      } catch (err) {
        req.flash("error", err.message);
      }
    }
    await breeder.save();
    res.redirect(`/breeder/${breeder._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const breeder = await Breeder.findByIdAndDelete(id);

    req.flash("success", "Animal deleted successfully");
    res.redirect("/breeder");
  })
);

module.exports = router;
