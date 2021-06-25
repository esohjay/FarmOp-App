const express = require('express');

const router = express.Router({mergeParams: true});

const Expense = require('../models/expense')
const Animal = require('../models/animal')
const {isLoggedin, validateExpense} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');



router.post('/', isLoggedin, validateExpense, catchAsync( async (req, res) => {
     const {id} = req.params;
    const animal = await Animal.findById(id)
   const expense = new Expense(req.body.expense)
   expense.creator = req.user._id
    animal.expenses.push(expense);
   await expense.save();
   await animal.save();
   res.redirect(`/animal/${animal._id}`)
}));

router.delete('/:expenseId', isLoggedin,  catchAsync( async(req, res) => {
     
     const {id, expenseId} = req.params;
       await Animal.findByIdAndUpdate(id, { $pull: { expenses: expenseId } });
    await Expense.findByIdAndDelete(expenseId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/animal/${id}`)
}))








module.exports = router