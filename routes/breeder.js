const express = require('express');
const router = express.Router({mergeParams: true});
const Breeder = require('../models/breeder')

const FarmStock = require('../models/farmstock')

const {isLoggedin, validateFarmstock, validateLivestockEdit} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');






//Create new livestock
router.post('/',    catchAsync( async (req, res) => {
     const {id} = req.params;
    const farmstock = await FarmStock.findById(id)
    //const {tag, sex, breed, dob, description, sire, dam, image} = farmstock;
   const breeder = new Breeder({
      
     tag : farmstock.tag,
       sex : farmstock.sex,
       breed : farmstock.breed,
       dob : farmstock.dob,
       description : farmstock.description,
       sire : farmstock.sire,
       dam : farmstock.dam,
       image : farmstock.image,
       category : farmstock.category,
   })
   
   await breeder.save();
   
     res.redirect(`/breeder/${breeder._id}`)
}));

module.exports = router