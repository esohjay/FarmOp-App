const express = require('express');

const router = express.Router({mergeParams: true});

const cropExpense = require('../models/cropExpense')
const Crop = require('../models/crop')
const {isLoggedin, validateExpense} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.get('/', isLoggedin, catchAsync(  async(req, res) => {
    const expense = await cropExpense.find({})
    res.render('income/index', {expense})
}));
router.get('/new', isLoggedin, catchAsync(async (req, res) => {
    const {id} = req.params
    const crop = await Crop.findById(id)
    res.render('expense/new', {crop})
}));
router.post('/', isLoggedin, validateExpense, catchAsync( async (req, res) => {
    const {id} = req.params
     const crop = await Crop.findById(id)
   const expense = new cropExpense(req.body.expense)
   crop.expenses.push(expense);
   await expense.save()
   await crop.save()
   res.redirect(`/crop/${crop._id}`)
}));
router.get('/:id', isLoggedin, catchAsync( async (req, res) => {
    const {id} = req.params
    const expense = await cropExpense.findById(id)
    res.render('expense/show', {expense})
}))

router.put('/:id', isLoggedin, validateExpense, catchAsync( async(req, res) => {
     const {id} = req.params
   const expense = await cropExpense.findByIdAndUpdate(id, { ...req.body.expense });
   await expense.save()
   res.redirect(`/expense/${expense._id}`)
}));
router.delete('/:expenseId', isLoggedin, catchAsync( async(req, res) => {
     const {id, expenseId} = req.params;
       await Crop.findByIdAndUpdate(id, { $pull: { expenses: expenseId } });
    await cropExpense.findByIdAndDelete(expenseId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/crop/${id}`)
}))








module.exports = router