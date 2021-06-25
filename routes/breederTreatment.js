const express = require('express');
const router = express.Router({mergeParams: true});
const Breeder = require('../models/breeder')
const {isLoggedin, validateTreatment} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Treatment = require('../models/treatment');
const Expense = require('../models/expense');





router.post('/', isLoggedin, validateTreatment, catchAsync( async (req, res) => {
   const {id} = req.params
    const breeder = await Breeder.findById(id)
    const treatment = new Treatment(req.body.treatment)
    const expenses = new Expense({
        expense: treatment.treatmentName,
        date: treatment.date,
        amount: treatment.cost,
        name: treatment.name,
        note: `${treatment.dose} of ${treatment.drug} was used for this treatment`
    }) 
    treatment.creator = req.user._id;
    expenses.creator = req.user._id;
   breeder.treatments.push(treatment);
   
   await treatment.save()
    await expenses.save()
   await breeder.save()
   res.redirect(`/breeder/${breeder._id}`)
}));



router.delete('/:tId', isLoggedin,  catchAsync(async(req, res) => {
     const {id, tId} = req.params;
       await Breeder.findByIdAndUpdate(id, { $pull: { treatments: tId } });
    await Treatment.findByIdAndDelete(tId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/breeder/${id}`)
}))



module.exports = router