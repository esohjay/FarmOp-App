const express = require('express');

const router = express.Router({mergeParams: true});

const cropIncome = require('../models/cropIncome')
const Crop = require('../models/crop')

const {isLoggedin, validateIncome} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.get('/', isLoggedin, catchAsync(  async(req, res) => {
    const inflow = await cropIncome.find({})
    res.render('cropinflow/index', {inflow})
}));
router.get('/new', isLoggedin, catchAsync(async (req, res) => {
   const crop = await Crop.find({})
    res.render('cropinflow/new', {crop})
}));
router.post('/', isLoggedin, validateIncome, catchAsync( async (req, res) => {
    const income = new cropIncome(req.body.income)
    await income.save()
    res.redirect(`/cropinflow/${income._id}`)
}));
router.get('/:id', isLoggedin, catchAsync( async (req, res) => {
    const {id} = req.params
    const income = await cropIncome.findById(id)
    res.render('cropinflow/show', {income})
}))
router.get('/:id/edit', isLoggedin, catchAsync( async(req, res) => {
    const {id} = req.params
    const income = await cropIncome.findById(id)
     const crop = await Crop.find({})
    res.render('cropinflow/edit', {income, crop})
}))
router.put('/:id', isLoggedin, validateIncome, catchAsync( async(req, res) => {
     const {id} = req.params
   const income = await cropIncome.findByIdAndUpdate(id, { ...req.body.income });
   await income.save()
   res.redirect(`/cropinflow/${income._id}`)
}));
router.delete('/:id', isLoggedin, catchAsync( async(req, res) => {
      const {id} = req.params;
      await cropIncome.findByIdAndDelete(id);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/cropinflow`)
}))








module.exports = router