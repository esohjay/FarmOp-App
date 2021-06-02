const express = require("express");
const router = express.Router({ mergeParams: true });
const Breeder = require("../models/breeder");
const Sales = require("../models/sales");
const FarmStock = require("../models/farmstock");
const Income = require("../models/income");
const DeadOnes = require("../models/deadAnimals");

const {
  isLoggedin,
  validateFarmstock,
  validateLivestockEdit,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//Sell animal
router.post(
  "/sold",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    //const farmstock = await FarmStock.findByIdAndDelete(id)
    const farmstock = await FarmStock.findById(id);
    const { tag, name, batch, breed, sex, description } = farmstock;
    const sales = new Sales({
      name: name,
      tag: tag,
      batch: batch,
      breed: breed,
      sex: sex,
      description: description,
      amount: req.body.amount,
    });
    const income = new Income({
      income: `Sold ${tag}`,
      name: name,
      date: Date.now(),
      amount: req.body.amount,
      note: `${name} with tag number ${tag}, batch ${batch} has been sold `,
    });

    await farmstock.delete(id);
    await sales.save();
    await income.save();
    req.flash("success", `${tag} sale has been successfully recorded`);
    res.redirect("/farmstock");
  })
);

//dead animals
router.post(
  "/dead",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    //const farmstock = await FarmStock.findByIdAndDelete(id)
    const farmstock = await FarmStock.findById(id);
    const { tag, name, batch, breed, sex, description } = farmstock;
    const deadAnimal = new DeadOnes({
      name: name,
      tag: tag,
      batch: batch,
      breed: breed,
      sex: sex,
      description: description,
      cause: req.body.cause,
    });

    await farmstock.delete(id);
    await deadAnimal.save();

    req.flash("success", `${tag} death has been successfully recorded`);
    res.redirect("/farmstock");
  })
);

//Create new Breeder
router.post(
  "/breeds",
  isLoggedin,
  catchAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const farmstock = await FarmStock.findById(id);
      //const {tag, sex, breed, dob, description, sire, dam, image} = farmstock;
      const breeder = new Breeder({
        tag: farmstock.tag,
        sex: farmstock.sex,
        breed: farmstock.breed,
        dob: farmstock.dob,
        description: farmstock.description,
        sire: farmstock.sire,
        dam: farmstock.dam,
        image: farmstock.image,
        category: farmstock.category,
        name: farmstock.name,
      });

      await breeder.save();

      res.redirect(`/breeder/${breeder._id}`);
    } catch (err) {
      let error = err.message;
      if (
        error.includes("duplicate") &&
        error.includes("index: tag_1 dup key")
      ) {
        req.flash("error", "Tag Number already exist");

        //res.redirect('/animal/new' , {name , batch, category, breed, quantity, source, description })
        res.redirect("back");
      }
    }
  })
);

module.exports = router;
