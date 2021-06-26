const express = require('express');
const router = express.Router({mergeParams: true});
const Animal = require('../models/animal')
const {isLoggedin, isAnAdmin, validateTreatment} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Treatment = require('../models/treatment');
const Expense = require('../models/expense');





router.post('/', isLoggedin, isAnAdmin, validateTreatment, catchAsync( async (req, res) => {
   const {id} = req.params
    const animal = await Animal.findById(id)
    const treatment = new Treatment(req.body.treatment)
    const expenses = new Expense({
        expense: treatment.treatmentName,
        date: treatment.date,
        amount: treatment.cost,
        name: treatment.name,
        note: `${treatment.dose} of ${treatment.drug} was used for this treatment`
    }) 
    treatment.creator = req.user._id;
    expenses.creator = req.user._id
   animal.treatments.push(treatment);
   animal.expenses.push(expenses);
   
   await treatment.save()
   await expenses.save()
   await animal.save()
   res.redirect(`/animal/${animal._id}`)
}));



router.delete('/:tId', isLoggedin, isAnAdmin,  catchAsync(async(req, res) => {
     const {id, tId} = req.params;
       await Animal.findByIdAndUpdate(id, { $pull: { treatments: tId } });
    await Treatment.findByIdAndDelete(tId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/animal/${id}`)
}))



module.exports = router