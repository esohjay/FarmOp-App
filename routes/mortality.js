const express = require('express');
const router = express.Router({mergeParams: true});
const Animal = require('../models/animal')
const {isLoggedin, validateMortality} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Mortality = require('../models/mortality');





router.post('/', isLoggedin, validateMortality, catchAsync( async (req, res) => {
   const {id} = req.params
    const animal = await Animal.findById(id)
    const animalMortality = new Mortality(req.body.mortality)
    animalMortality.creator = req.user._id
   animal.mortality.push(animalMortality);
   
   await animalMortality.save()
   
   await animal.save()
   res.redirect(`/animal/${animal._id}`)
}));



router.delete('/:mId', isLoggedin,  catchAsync(async(req, res) => {
     const {id, mId} = req.params;
       await Animal.findByIdAndUpdate(id, { $pull: { mortality: mId } });
    await Mortality.findByIdAndDelete(mId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/animal/${id}`)
}))



module.exports = router