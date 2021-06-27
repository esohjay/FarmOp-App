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
  isAnAdmin,
} = require("../middleware");
const {calcAge, setImage} = require("../utils/logics")
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const changeDate = require("../utils/changeDate");

router.get(
  "/", isLoggedin,
  searchAndFilter,
  sortDlisplay,
  catchAsync(async (req, res) => {
    
    
   
const options = {
      page: req.query.page || 1,
      limit: 20,
      sort: { createdAt : -1}
    }
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
    const farmstock = await FarmStock.paginate(dbQuery || {creator: req.user.farmId}, options);
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

router.get("/new", isLoggedin, isAnAdmin, (req, res) => {
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
  isLoggedin, isAnAdmin,
  upload.single("image"),
  validateFarmstock,
  catchAsync(async (req, res) => {
    
      const farmstock = new FarmStock(req.body.farmstock);
      farmstock.creator = req.user._id
       
       
      const animalName  = farmstock.name
     
      if (req.file) {
        const { path, filename } = req.file;
        farmstock.image = { url: path, filename: filename };
      } else if (req.file === undefined) {
       
      farmstock.image = setImage(farmstock.image, animalName) 
      
      }
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
      const exist = await FarmStock.find({$and: [{creator: req.user._id}, {tag: farmstock.tag}]})
      if(exist.length){
        req.flash("error", "Tag Number already exist");
        error = "Tag Number already exist";
       
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

      }else{
         await farmstock.save();
      res.redirect(`/farmstock/${farmstock._id}`);
    
      }
 })
);

router.get(
  "/:id", isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farmstock = await FarmStock.findById(id).populate("treatments");;
      if (!farmstock) {
      req.flash("error", "No livestock found");
      return res.redirect("/farmstock");
    }
    const age = calcAge(farmstock.dob)
    res.render("farmstock/show", { farmstock, age });
  })
);

router.get(
  "/:id/edit",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farmstock = await FarmStock.findById(id);
    const dob = changeDate(farmstock.dob)
    res.render("farmstock/edit", { farmstock, dob });
  })
);

router.put(
  "/:id",
  isLoggedin, isAnAdmin,
  upload.single("image"),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const {tag} = req.body.farmstock;
    
     const exist = await FarmStock.find({$and: [{creator: req.user._id}, {tag: tag}]})
      if(exist.length){
        req.flash("error", "Tag Number already exist");
        error = "Tag Number already exist";
       
      res.redirect(`/farmstock/${id}/edit`);
}else{
       
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
      }
   
   
  })
);

router.delete(
  "/:id",
  isLoggedin,isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farmstock = await FarmStock.findByIdAndDelete(id);
    req.flash("success", "Animal deleted successfully");
    res.redirect("/farmstock");
  })
);

module.exports = router;
