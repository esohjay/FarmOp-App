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


router.post('/', isLoggedin, upload.single('image'), validateFarmstock, catchAsync( async (req, res) => {
  try {const {id} = req.params
   
    const breeder = await Breeder.findById(id)
    const farmstock = new FarmStock(req.body.farmstock)
    const {path, filename} = req.file
   farmstock.image = {url: path, filename: filename};
  const newBreeder = breeder.farmstock.push(farmstock);
   //animal.livestock.push(updatedLivestock)
   await farmstock.save()
   await breeder.save()
   
   res.redirect(`/breeder/${breeder._id}`)}
   catch(err){
       const {name , tag, category, sire, dam, breed, sex,  productionStage, description, healthStatus } = req.body.farmstock;
       let error = err.message;
       if(error.includes('duplicate') && error.includes('index: tag_1 dup key')){
            req.flash('error', 'Tag Number already exist')
            //error = 'Tag Number already exist'
            //res.redirect('/animal/new' , {name , batch, category, breed, quantity, source, description })
             res.redirect('back')
       }
     
       
     
    }
}));



router.get('/:fId',catchAsync( async (req, res) => {
    const { fId, id} = req.params
    
    const breeder = await Breeder.findById(id);
    const farmstock = await FarmStock.findById(fId);
   res.render('farmstock/show', { farmstock, breeder})
}))



module.exports = router