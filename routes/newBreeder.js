const express = require('express');
const router = express.Router({mergeParams: true});
const Breeder = require('../models/breeder')
const multer = require('multer')
const {storage, cloudinary} = require('../cloudinary');
const upload = multer({storage});
const {isLoggedin, validateFarmstock, validateLivestockEdit} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const farmstock = require('../models/farmstock');


router.get('/',  catchAsync(async(req, res) => {
    const breeder = await Breeder.find({})
    res.render('breeder/index', {breeder})
}));

router.get('/new', isLoggedin, (req, res) => {
    res.render('breeder/new')
});


//Create new livestock
router.post('/', isLoggedin, upload.single('image'),  catchAsync( async (req, res) => {
     const {id} = req.params;
     const breeder = new Breeder(req.body.breeder)
    const {path, filename} = req.file
   breeder.image = {url: path, filename: filename};
    await breeder.save();
    res.redirect(`/breeder/${breeder._id}`)
}));

router.get('/:id',catchAsync( async (req, res) => {
    const {id} = req.params
    
    const breeder = await Breeder.findById(id).populate('breeding').populate('farmstock')
    res.render('breeder/show', {breeder})
}));

router.get('/:id/edit', isLoggedin, catchAsync( async(req, res) => {
    const {id} = req.params
    const breeder = await Breeder.findById(id)
     res.render('breeder/edit', {breeder})
}));

router.put('/:id',  isLoggedin, upload.single('image'),  catchAsync( async(req, res) => {
     const {id} = req.params
   const breeder = await Breeder.findByIdAndUpdate(id, { ...req.body.breeder });
   if(breeder.image && req.file){
try{
    await cloudinary.uploader.destroy(breeder.image.filename)
     const {path, filename} = req.file
   breeder.image = {url: path, filename: filename};
} catch (err){
req.flash('error', err.message)
}
 }
 await breeder.save()
  res.redirect(`/breeder/${breeder._id}`)
}));

router.delete('/:id', isLoggedin,  catchAsync( async(req, res) => {
     const {id} = req.params;
     const breeder = await Breeder.findByIdAndDelete(id)
    
       req.flash('success', 'Animal deleted successfully')
      res.redirect('/breeder')
}))

module.exports = router