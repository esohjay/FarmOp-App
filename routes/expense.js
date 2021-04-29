const express = require('express');

const router = express.Router();

const Expense = require('../models/expense')

const {isLoggedin, validateExpense} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


router.get('/', isLoggedin, catchAsync(async (req, res) => {
   const expenses = await Expense.find({});
    res.render('expense/index', {expenses})
}));
router.get('/new', isLoggedin,  (req, res) => {
  
    res.render('expense/new')
});
router.post('/', isLoggedin, validateExpense, catchAsync( async (req, res) => {
  const expense = new Expense(req.body.expense)
   await expense.save();
    res.redirect(`/expense/${expense._id}`)
}));
router.get('/:id', isLoggedin, catchAsync(async (req, res) => {
    const {id} = req.params
    const expense = await Expense.findById(id)
    res.render('expense/show', {expense})
}))
router.get('/:id/edit', isLoggedin,  catchAsync( async(req, res) => {
    const {id} = req.params
    const expense = await Expense.findById(id)
    res.render('expense/edit', {expense})
}))
router.put('/:id', isLoggedin, validateExpense, catchAsync( async(req, res) => {
     const {id} = req.params
   const expense = await Expense.findByIdAndUpdate(id, { ...req.body.expense });
   await expense.save()
   res.redirect(`/expense/${expense._id}`)
}));
router.delete('/:id', isLoggedin,  catchAsync( async(req, res) => {
     
     const { id} = req.params;
      
    await Expense.findByIdAndDelete(id);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/expense`)
}))








module.exports = router