const express = require('express');

const router = express.Router();

const Income = require('../models/income')

const {isLoggedin, validateIncome} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


router.get('/', isLoggedin, catchAsync(async (req, res) => {
   const inflow = await Income.find({});
    res.render('income/index', {inflow})
}));
router.get('/new', isLoggedin,  (req, res) => {
  
    res.render('income/new')
});
router.post('/', isLoggedin, validateIncome, catchAsync( async (req, res) => {
    const income = new Income(req.body.income)
   await income.save()
    res.redirect(`/income/${income._id}`)
}));

router.get('/:id', catchAsync( async (req, res) => {
    const {id} = req.params
    const income = await Income.findById(id)
    res.render('income/show', {income})
}))
router.get('/:id/edit', isLoggedin, catchAsync( async(req, res) => {
    const {id} = req.params
    const income = await Income.findById(id)
    res.render('income/edit', {income})
}))
router.put('/:id', isLoggedin, validateIncome, catchAsync( async(req, res) => {
     const {id} = req.params
   const income = await Income.findByIdAndUpdate(id, { ...req.body.income });
   await income.save()
   res.redirect(`/income/${income._id}`)
}));
router.delete('/:incomeId', isLoggedin, catchAsync( async(req, res) => {
     const {id} = req.params;
      
    await Income.findByIdAndDelete(id);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/income`)
}))








module.exports = router