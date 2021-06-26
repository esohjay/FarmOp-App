const express = require("express");

const router = express.Router();
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
//const upload = multer({storage})
var upload = multer({ storage });
const CTask = require("../models/cropTask");
const Crop = require("../models/crop");
const User = require("../models/user");
const Field = require("../models/field");
const {
  isLoggedin,
  validateCrop,
  isAnAdmin,
  searchAndFilter,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const changeDate = require("../utils/changeDate");
const createTask = require("../utils/createTask");
const ExpressError = require("../utils/ExpressError");

router.get(
  "/",isLoggedin,
  searchAndFilter,
  catchAsync(async (req, res) => {
    const { dbQuery } = res.locals;
    delete res.locals.dbQuery;
    const options = {
      page: req.query.page || 1,
      limit: 15,
      sort: { createdAt: -1 },
    };
    const crops = await Crop.paginate(dbQuery || {creator: req.user.farmId}, options);
    if (!crops.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("crop/index", { crops });
  })
);
router.get(
  "/new",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const field = await Field.find({creator: req.user._id});
    res.render("crop/new", { field });
  })
);
router.post(
  "/",
  isLoggedin, isAnAdmin,
  upload.single("image"),
  validateCrop,
  catchAsync(async (req, res) => {
    const crop = new Crop(req.body.crop);
    crop.creator = req.user._id
    if (req.file) {
    const { path, filename } = req.file;
    crop.image = { url: path, filename: filename };
 } else {
    crop.image = {
          url: "",
          filename: "Unnamed",
        };
      }
    //await crop.save();

    const newTask = [
      "Planting",
      "Spraying",
      "Fertilizer Application",
      "Harvesting",
    ];
    const task = createTask(newTask, crop.tasks, crop.date, crop.crop, 2, 4, req.user._id)
    
      
      await crop.save();
    

    res.redirect(`/crop/${crop._id}`);
  })
);
router.get(
  "/:id", isLoggedin, 
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const crop = await Crop.findById(id)
      .populate("events")
      .populate("inflow")
      .populate("expenses")
      .populate("tasks")
      .populate("inputs");
    const staff = await User.find({farmId: req.user._id})
    if (!crop) {
      req.flash("error", "No crop found");
      return res.redirect("/crop");
    }
    res.render("crop/show", { crop, staff });
  })
);
router.get(
  "/:id/edit",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const crop = await Crop.findById(id);
    const plantDate = changeDate(crop.date)
    const field = await Field.find({creator: req.user._id});
    res.render("crop/edit", { crop, field, plantDate });
  })
);
router.put(
  "/:id",
  isLoggedin, isAnAdmin,
  upload.single("image"),
  validateCrop,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const crop = await Crop.findByIdAndUpdate(id, { ...req.body.crop });
    
    if (crop.image && req.file) {
      try {
        await cloudinary.uploader.destroy(crop.image.filename);
        const { path, filename } = req.file;
        crop.image = { url: path, filename: filename };
      } catch (err) {
        req.flash("error", err.message);
      }
    }

    await crop.save();
    res.redirect(`/crop/${crop._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const crop = await Crop.findByIdAndDelete(id);
    if (crop.image) {
      try {
        await cloudinary.uploader.destroy(crop.image.filename);
      } catch (err) {
        req.flash("error", err.message);
      }
    }

    req.flash("success", "Crop successfully deleted");
    res.redirect("/crop");
  })
);

module.exports = router;
