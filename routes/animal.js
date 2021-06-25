const express = require("express");
const router = express.Router();
const Animal = require("../models/animal");
const User = require("../models/user");
const {
  isLoggedin,
  validateLivestock,
  searchAndFilter,
  sortDlisplay,
  isAnAdmin,
  
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const changeDate = require("../utils/changeDate")
const {setImageAnimal} = require("../utils/logics")
const ExpressError = require("../utils/ExpressError");
const  Farmstock = require("../models/farmstock");

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
      limit: 15,
      sort: { createdAt: -1 },
    };
    let names = [];
    let categories = [];

    let batch = [];
    let breed = [];

    const animals = await Animal.paginate(dbQuery || {creator: req.user.farmId}, dbOption || options);
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

router.get("/new", isLoggedin, isAnAdmin, (req, res) => {
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
  isLoggedin, isAnAdmin,
  validateLivestock,
  catchAsync(async (req, res) => {
    
      const animal = new Animal(req.body.animal);
     animal.creator = req.user._id;
     const animalName = animal.name;
      const animalImage = setImageAnimal(animal.image, animalName)
      animal.image = animalImage
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
       const exist = await Animal.find({$and: [{creator: req.user._id}, {batch: animal.batch}]})

       if(exist.length){
        req.flash("error", "Batch ID already exist");
        error = "Batch ID already exist";
      
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

      }else{
        await animal.save();
      res.redirect(`/animal/${animal._id}`);
    
      }
  })
);

router.get(
  "/:id", isLoggedin,
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
      .populate("mortality")
      .populate("treatments");
      const farmstock = await Farmstock.find({creator: req.user.farmId, batch: animal.batch} )
        
       const farmstocks = await Farmstock.find({creator: req.user._id})
        
        
    const staff = await User.find({farmId: req.user._id});
    if (!animal) {
      req.flash("error", "No batch found");
      return res.redirect("/animal");
    }
    res.render("animal/show", { animal, staff, farmstock, farmstocks });
  })
);

router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findById(id);
    
const arrivaldate = changeDate(animal.dateOfArrival)
    res.render("animal/edit", { animal, arrivaldate});
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

router.put("/:id/group", catchAsync(async (req, res) => {
    const {id} = req.params
    const ids = req.body.farmstock;
    const animal = await Animal.findById(id)
   const farmstock = await Farmstock.updateMany({_id: {$in: ids}}, { $set: { batch: animal.batch }})
   
    req.flash('success', "Added to group")
     res.redirect(`/animal/${animal._id}`);
}))

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
