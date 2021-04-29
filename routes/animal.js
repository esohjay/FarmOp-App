const express = require('express');
const router = express.Router();
const Animal = require('../models/animal')
const User = require('../models/user')
const {isLoggedin, validateLivestock, validateLivestockEdit} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


router.get('/',   catchAsync(async(req, res) => {
    const animals = await Animal.find({})
    res.render('animal/index', {animals})
}));

router.get('/new', isLoggedin, (req, res) => {
    res.render('animal/new')
});

router.post('/', isLoggedin, validateLivestock, catchAsync( async (req, res) => {
   const animal = new Animal(req.body.animal)
await animal.save()
    res.redirect(`/animal/${animal._id}`)
}));

router.get('/:id',catchAsync( async (req, res) => {
    const {id} = req.params
    const animal = await Animal.findById(id).populate('events').populate('tasks').populate('weight').populate('farmstock').populate('feed').populate('egg').populate('inflow').populate('expenses').populate('mortality')
    const staff = await User.find({});
    res.render('animal/show', {animal, staff})
}))





router.get('/:id/edit', isLoggedin,  catchAsync( async(req, res) => {
    const {id} = req.params
    const animal = await Animal.findById(id)
    res.render('animal/edit', {animal})
}))

router.put('/:id',  isLoggedin, validateLivestock,  catchAsync( async(req, res) => {
     const {id} = req.params
   const animal = await Animal.findByIdAndUpdate(id, { ...req.body.animal });
   
 await animal.save()
   res.redirect(`/animal/${animal._id}`)
}));


router.delete('/:id', isLoggedin,  catchAsync( async(req, res) => {
     const {id} = req.params;
     const animal = await Animal.findByIdAndDelete(id)
    
       req.flash('success', 'Animal deleted successfully')
      res.redirect('/animal')
}))


module.exports = router