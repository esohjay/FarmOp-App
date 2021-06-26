const express = require('express');
const router = express.Router({mergeParams: true});
const Animal = require('../models/animal')
const {isLoggedin, isAnAdmin, validateWeight} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Weight = require('../models/weight');




router.post('/', isLoggedin, isAnAdmin, validateWeight, catchAsync( async (req, res) => {
   const {id} = req.params
    const animal = await Animal.findById(id)
    const avWeight= new Weight(req.body.weight)
    avWeight.creator = req.user._id
   animal.weight.push(avWeight);
   
   await avWeight.save()
   
   await animal.save()
   res.redirect(`/animal/${animal._id}`)
}));

router.delete('/:wId', isLoggedin, isAnAdmin, catchAsync( async(req, res) => {
     const {id, wId} = req.params;
       await Animal.findByIdAndUpdate(id, { $pull: { weight: wId } });
    await Weight.findByIdAndDelete(wId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/animal/${id}`)
}))



module.exports = router