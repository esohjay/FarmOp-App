const express = require('express');
const router = express.Router({mergeParams: true});

const Breeder = require('../models/breeder')
const multer = require('multer')
const {storage, cloudinary} = require('../cloudinary')
const upload = multer({storage})
const {isLoggedin, validateFarmstock} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const FarmStock = require('../models/farmstock');
const {setImage} = require("../utils/logics")

router.post('/', isLoggedin, upload.single('image'), validateFarmstock, catchAsync( async (req, res) => {
  const {id} = req.params
   
    const breeder = await Breeder.findById(id)
    const farmstock = new FarmStock(req.body.farmstock)
    farmstock.creator = req.user._id
    const animalName = farmstock.name
     
      if (req.file) {
        const { path, filename } = req.file;
        farmstock.image = { url: path, filename: filename };
      } else if (req.file === undefined) {
         farmstock.image = setImage(farmstock.image, animalName) 
     
      }
      const exist = await FarmStock.find({$and: [{creator: req.user._id}, {tag: farmstock.tag}]})
      if(exist.length){
        req.flash("error", "Tag Number already exist");
       res.redirect("back");

      }else{
         breeder.farmstock.push(farmstock);
   await farmstock.save()
   await breeder.save()
    res.redirect(`/breeder/${breeder._id}`)
      }
 
}));



router.get('/:fId',catchAsync( async (req, res) => {
    const { fId, id} = req.params
    
    const breeder = await Breeder.findById(id);
    const farmstock = await FarmStock.findById(fId);
   res.render('farmstock/show', { farmstock, breeder})
}))



module.exports = router