const express = require('express');
const router = express.Router({mergeParams: true});
const Breeder = require('../models/breeder')

const {isLoggedin, isAnAdmin, validateMating, validateParturition} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Breeding = require('../models/breeding');


router.post('/', isLoggedin, isAnAdmin, validateMating, catchAsync( async (req, res) => {
   const {id} = req.params
   
    const breeder = await Breeder.findById(id)
    const breed = new Breeding(req.body.breed)
    breed.creator = req.user._id
  const newBreeder = breeder.breeding.push(breed);
   //animal.livestock.push(updatedLivestock)
   
   await breed.save()
   
   await breeder.save()
  
   res.redirect(`/breeder/${breeder._id}`)
}));

router.put('/:bId',  isLoggedin, isAnAdmin, validateParturition, catchAsync( async(req, res) => {
     const {id, bId} = req.params
    
    const breeder = await Breeder.findById(id)
   const breed = await Breeding.findByIdAndUpdate(bId, { ...req.body.breed });
   
 await breed.save()
   res.redirect(`/breeder/${breeder._id}`)
}));


router.delete('/:bId', isLoggedin, isAnAdmin, catchAsync( async(req, res) => {
     const {id,  bId} = req.params;
    
    const breeder =   await Breeder.findByIdAndUpdate(id, { $pull: { breeding: bId } });
    await Breeding.findByIdAndDelete(bId);
     //const animal = await Animal.findByIdAndUpdate(id, { $set: { livestock: updatedLivestock } })
     await breeder.save()
   ///await animal.save()
    req.flash('success', 'Deleted successfully')
      res.redirect(`/breeder/${breeder._id}`)
}))


module.exports = router