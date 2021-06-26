const express = require('express');
const router = express.Router({mergeParams: true});
const Animal = require('../models/animal')
const {isLoggedin, isAnAdmin, validateEgg} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Egg = require('../models/egg');





router.post('/', isLoggedin, isAnAdmin, validateEgg, catchAsync( async (req, res) => {
   const {id} = req.params
    const animal = await Animal.findById(id)
    const animalEgg = new Egg(req.body.egg)
    animalEgg.creator = req.user._id
   animal.egg.push(animalEgg);
   
   await animalEgg.save()
   
   await animal.save()
   res.redirect(`/animal/${animal._id}`)
}));

router.delete('/:eId', isLoggedin, isAnAdmin, catchAsync( async(req, res) => {
     const {id, eId} = req.params;
       await Animal.findByIdAndUpdate(id, { $pull: { egg: eId } });
    await Egg.findByIdAndDelete(eId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/animal/${id}`)
}))



module.exports = router