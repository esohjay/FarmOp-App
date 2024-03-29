const express = require('express');

const router = express.Router({mergeParams: true});

const Income = require('../models/income')
const Animal = require('../models/animal')
const {isLoggedin, isAnAdmin,validateIncome} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');



router.post('/', isLoggedin, isAnAdmin, validateIncome, catchAsync( async (req, res) => {
    const {id} = req.params
     const animal = await Animal.findById(id)
   const income = new Income(req.body.income)
   income.creator = req.user._id
   animal.inflow.push(income);
   await income.save()
   await animal.save()
   res.redirect(`/animal/${animal._id}`)
}));


router.delete('/:incomeId', isLoggedin, isAnAdmin, catchAsync( async(req, res) => {
     const {id, incomeId} = req.params;
       await Animal.findByIdAndUpdate(id, { $pull: { inflow: incomeId } });
    await Income.findByIdAndDelete(incomeId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/animal/${id}`)
}))

module.exports = router