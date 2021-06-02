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
  validateCropEdit,
  searchAndFilter,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get(
  "/",
  searchAndFilter,
  catchAsync(async (req, res) => {
    const { dbQuery } = res.locals;
    delete res.locals.dbQuery;
    const options = {
      page: req.query.page || 1,
      limit: 15,
      sort: { createdAt: -1 },
    };
    const crops = await Crop.paginate(dbQuery, options);
    if (!crops.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("crop/index", { crops });
  })
);
router.get(
  "/new",
  isLoggedin,
  catchAsync(async (req, res) => {
    const field = await Field.find({});
    res.render("crop/new", { field });
  })
);
router.post(
  "/",
  isLoggedin,
  upload.single("image"),
  validateCrop,
  catchAsync(async (req, res) => {
    const crop = new Crop(req.body.crop);
    //console.log(req.file)
    const { path, filename } = req.file;
    crop.image = { url: path, filename: filename };

    await crop.save();

    const newTask = [
      "Planting",
      "Spraying",
      "Fertilizer Application",
      "Harvesting",
    ];
    for (let nTask of newTask) {
      const task = new CTask({
        task: nTask,
        deadline: Date.now(),
        startDate: Date.now(),
        leader: "Not Yet Assigned",
        workers: ["Not Yet Assigned"],
        status: "Pending",
        instructions: "Not yet Started",
        name: crop.crop,
      });
      crop.tasks.push(task);

      await task.save();

      await crop.save();
    }

    res.redirect(`/crop/${crop._id}`);
  })
);
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const crop = await Crop.findById(id)
      .populate("events")
      .populate("inflow")
      .populate("expenses")
      .populate("tasks");
    const staff = await User.find({});

    res.render("crop/show", { crop, staff });
  })
);
router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const crop = await Crop.findById(id);
    const field = await Field.find({});
    res.render("crop/edit", { crop, field });
  })
);
router.put(
  "/:id",
  isLoggedin,
  upload.single("image"),
  validateCropEdit,
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
  isLoggedin,
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
