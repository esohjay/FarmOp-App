const express = require("express");
const router = express.Router({ mergeParams: true });
const Breeder = require("../models/breeder");
const Sales = require("../models/sales");
const FarmStock = require("../models/farmstock");
const Income = require("../models/income");
const DeadOnes = require("../models/deadAnimals");

const {
  isLoggedin,

  searchAndFilter,
  sortDlisplay,
  isAnAdmin,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//Sell animal
router.post(
  "/sold", isLoggedin, isAnAdmin,
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
    sales.creator = req.user._id;
    income.creator = req.user._id;
    await farmstock.delete(id);
    await sales.save();
    await income.save();
    req.flash("success", `${tag} sale has been successfully recorded`);
    res.redirect("/farmstock");
  })
);
//get sales index
router.get(
  "/sales",
  searchAndFilter,
  isLoggedin,
  sortDlisplay,
  catchAsync(async (req, res) => {
    const { dbQuery, dbOption } = res.locals;
    delete res.locals.dbQuery;
    delete res.locals.dbOption;
    const options = {
      page: req.query.page || 1,
      limit: 20,
      sort: { createdAt: -1 },
    };
    
    const sold = await Sales.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    
    if (!sold.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("sales/index", { sold});
  })
);

//get sales show page
router.get(
  "/sales/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const sales = await Sales.findById(id)
    
    if (!sales) {
      req.flash("error", "No input found");
      return res.redirect("/livestock/sales");
    }
    res.render("sales/show", { sales});
  })
);
router.delete(
  "/sales/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Sales.findByIdAndDelete(id);
    req.flash('success', 'Deleted successfully')
    res.redirect("/livestock/sales");
  })
);


//dead animals
router.post(
  "/dead", isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    //const farmstock = await FarmStock.findByIdAndDelete(id)
    const farmstock = await FarmStock.findById(id);
    const { tag, name, batch, breed, creator, sex, description } = farmstock;
    const deadAnimal = new DeadOnes({
      name: name,
      tag: tag,
      batch: batch,
      breed: breed,
      sex: sex,
      description: description,
      cause: req.body.cause,
      creator: creator
    });

    await farmstock.delete(id);
    await deadAnimal.save();

    req.flash("success", `${tag} death has been successfully recorded`);
    res.redirect("/farmstock");
  })
);


//get dead animal index
router.get(
  "/dead",
  searchAndFilter,
  isLoggedin,
  sortDlisplay,
  catchAsync(async (req, res) => {
    const { dbQuery, dbOption } = res.locals;
    delete res.locals.dbQuery;
    delete res.locals.dbOption;
    const options = {
      page: req.query.page || 1,
      limit: 20,
      sort: { createdAt: -1 },
    };
    
    const dead = await DeadOnes.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
    
    if (!dead.docs.length && dbQuery) {
      req.flash("error", "No result found");
      res.locals.error = "No result found";
    }
    res.render("dead/index", { dead});
  })
);
//get dead animal show page
router.get(
  "/dead/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const dead = await DeadOnes.findById(id)
    
    if (!dead) {
      req.flash("error", "No input found");
      return res.redirect("/livestock/dead");
    }
    res.render("dead/show", { dead});
  })
);


//delete dead
router.delete(
  "/dead/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await DeadOnes.findByIdAndDelete(id);
    req.flash('success', 'Deleted successfully')
    res.redirect("/livestock/dead");
  })
);

//Create new Breeder
router.post(
  "/breeds",
  isLoggedin, isAnAdmin,
  catchAsync(async (req, res) => {
   
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
        creator : farmstock.creator,
      });
      const exist = await Breeder.find({$and: [{creator: req.user._id}, {tag: breeder.tag}]})
      if(exist.length){
        req.flash("error", "Tag Number already exist");
        //error = "Tag Number already exist";
       
        res.redirect(`/farmstock/${farmstock._id}`);

      }else{
       await breeder.save();
       req.flash("success", `${breeder.tag} has been added to breeder`);
      res.redirect(`/breeder/${breeder._id}`);
    
      }
   
  })
);

//get clone animal form


router.post("/clone",  isLoggedin, isAnAdmin, catchAsync(async (req, res) => {
   const { id } = req.params;
      const farmstock = await FarmStock.findById(id);
const newFarmstock = new FarmStock({
        tag: `${farmstock.tag}(Copy)`,
        sex: farmstock.sex,
        breed: farmstock.breed,
        dob: farmstock.dob,
        description: farmstock.description,
        sire: farmstock.sire,
        dam: farmstock.dam,
        image: farmstock.image,
        category: farmstock.category,
        name: farmstock.name,
        creator : farmstock.creator,
        productionStage: farmstock.productionStage,
        healthStatus: farmstock.healthStatus,
})
const exist = await FarmStock.find({$and: [{creator: req.user._id}, {tag: newFarmstock.tag}]})
      if(exist.length){
        req.flash("error", "Tag Number already exist");
        //error = "Tag Number already exist";
        res.redirect(`/farmstock/${farmstock._id}`);
       }else{
       await newFarmstock.save();
       req.flash('success', 'Cloned Successfully')
      res.redirect(`/farmstock/${newFarmstock._id}`);
    
      }
}))

module.exports = router;
