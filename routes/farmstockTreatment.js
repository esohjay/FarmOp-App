const express = require('express');
const router = express.Router({mergeParams: true});
const Farmstock = require('../models/farmstock')
const {isLoggedin, validateTreatment} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Treatment = require('../models/treatment');
const Expense = require('../models/expense');





router.post('/', isLoggedin, validateTreatment, catchAsync( async (req, res) => {
   const {id} = req.params
    const farmstock = await Farmstock.findById(id)
    const treatment = new Treatment(req.body.treatment)
     const expenses = new Expense({
        expense: treatment.treatmentName,
        date: treatment.date,
        amount: treatment.cost,
        name: treatment.name,
        note: `${treatment.dose} of ${treatment.drug} was used for this treatment`
    }) 
   farmstock.treatments.push(treatment);
   treatment.creator = req.user._id
   expenses.creator = req.user._id
   await treatment.save()
   await expenses.save()
   
   await farmstock.save()
   res.redirect(`/farmstock/${farmstock._id}`)
}));



router.delete('/:tId', isLoggedin,  catchAsync(async(req, res) => {
     const {id, tId} = req.params;
       await Farmstock.findByIdAndUpdate(id, { $pull: { treatments: tId } });
    await Treatment.findByIdAndDelete(tId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/farmstock/${id}`)
}))



module.exports = router