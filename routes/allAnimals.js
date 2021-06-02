const express = require("express");
const router = express.Router();
const FarmStock = require("../models/farmstock");

const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const {
  isLoggedin,
  validateFarmstock,
  searchAndFilter,
  sortDlisplay,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get(
  "/",
  searchAndFilter,
  sortDlisplay,
  catchAsync(async (req, res) => {
    const options = {
      page: req.query.page || 1,
      limit: 100,
      sort: { createdAt: -1 },
    };

    //const { name, category } = req.query;
    const { dbQuery, dbOption } = res.locals;

    delete res.locals.dbQuery;
    delete res.locals.dbOption;
    let names = [];
    let categories = [];
    let dam = [];
    let sire = [];
    let batch = [];
    let breed = [];
    let pStage = [];
    const farmstock = await FarmStock.paginate(dbQuery, dbOption || options);
    for (let result of farmstock.docs) {
      names.push(result.name);
      sire.push(result.sire);
      dam.push(result.dam);
      batch.push(result.batch);
      breed.push(result.breed);
      pStage.push(result.productionStage);
      categories.push(result.category);
    }

    if (!farmstock.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("farmstock/index", {
      farmstock,
      names,
      categories,
      batch,
      sire,
      dam,
      breed,
      pStage,
    });
  })
);

router.get("/new", isLoggedin, (req, res) => {
  res.render("farmstock/new", {
    name: "",
    tag: "",
    sex: "",
    category: "",
    breed: "",
    productionStage: "",
    healthStatus: "",
    sire: "",
    dam: "",
    description: "",
  });
});

router.post(
  "/",
  isLoggedin,
  upload.single("image"),
  validateFarmstock,
  catchAsync(async (req, res) => {
    try {
      const farmstock = new FarmStock(req.body.farmstock);
      if (req.file) {
        const { path, filename } = req.file;
        farmstock.image = { url: path, filename: filename };
      } else {
        farmstock.image = {
          url: "https://res.cloudinary.com/djgprrm6h/image/upload/v1622291151/FarmApp/ytm7xx92b5ajqdjdwtfl.jpg",
          filename: "Unnamed",
        };
      }

      await farmstock.save();
      res.redirect(`/farmstock/${farmstock._id}`);
    } catch (err) {
      const {
        name,
        tag,
        category,
        sire,
        dam,
        breed,
        sex,
        productionStage,
        description,
        healthStatus,
      } = req.body.farmstock;
      let error = err.message;
      if (
        error.includes("duplicate") &&
        error.includes("index: tag_1 dup key")
      ) {
        req.flash("error", "Tag Number already exist");
        error = "Tag Number already exist";
        //res.redirect('/animal/new' , {name , batch, category, breed, quantity, source, description })
        res.render("farmstock/new", {
          name,
          tag,
          category,
          error,
          sire,
          dam,
          breed,
          sex,
          productionStage,
          description,
          healthStatus,
        });
      }
    }
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farmstock = await FarmStock.findById(id);

    res.render("farmstock/show", { farmstock });
  })
);

router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farmstock = await FarmStock.findById(id);
    res.render("farmstock/edit", { farmstock });
  })
);

router.put(
  "/:id",
  isLoggedin,
  upload.single("image"),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farmstock = await FarmStock.findByIdAndUpdate(id, {
      ...req.body.farmstock,
    });
    if (farmstock.image && req.file) {
      try {
        await cloudinary.uploader.destroy(farmstock.image.filename);
        const { path, filename } = req.file;
        farmstock.image = { url: path, filename: filename };
      } catch (err) {
        req.flash("error", err.message);
      }
    }
    await farmstock.save();
    req.flash("success", `${farmstock.tag} has been updated sucessfully`);
    res.redirect(`/farmstock/${farmstock._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farmstock = await FarmStock.findByIdAndDelete(id);
    req.flash("success", "Animal deleted successfully");
    res.redirect("/farmstock");
  })
);

module.exports = router;
