const express = require("express");
const router = express.Router({ mergeParams: true });
const Breeder = require("../models/breeder");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isLoggedin, searchAndFilter, sortDlisplay, validateBreeder } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const farmstock = require("../models/farmstock");
const changeDate = require("../utils/changeDate")
const {setImage} = require("../utils/logics")

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

    const breeder = await Breeder.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
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
  validateBreeder,
  catchAsync(async (req, res) => {
      const breeder = new Breeder(req.body.breeder);
      breeder.creator = req.user._id
      const animalName = breeder.name
       if (req.file) {
      const { path, filename } = req.file;
      breeder.image = { url: path, filename: filename };
       } else if(req.file === undefined){
         breeder.image = setImage(breeder.image, animalName) 
      }
      const { tag, category, sire, name, dam, breed, sex, description } =
        req.body.breeder;

        const exist = await Breeder.find({$and: [{creator: req.user._id}, {tag: breeder.tag}]})
      if(exist.length){
        req.flash("error", "Tag Number already exist");
        error = "Tag Number already exist";
       
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

      }else{
       await breeder.save();
      res.redirect(`/breeder/${breeder._id}`);
    
      }
  })
);

router.get(
  "/:id", isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const breeder = await Breeder.findById(id)
      .populate("breeding")
      .populate("farmstock").populate("treatments");;
      if (!breeder) {
      req.flash("error", "No breeder found");
      return res.redirect("/breeder");
    }
    res.render("breeder/show", { breeder });
  })
);

router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const breeder = await Breeder.findById(id);
    const dob = changeDate(breeder.dob)
    res.render("breeder/edit", { breeder, dob });
  })
);

router.put(
  "/:id",
  isLoggedin,
  upload.single("image"),
  validateBreeder,
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
