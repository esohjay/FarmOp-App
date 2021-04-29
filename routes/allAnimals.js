const express = require('express');
const router = express.Router();
const FarmStock = require('../models/farmstock')
const Income = require('../models/income')
const multer = require('multer')
const {storage, cloudinary} = require('../cloudinary')
const upload = multer({storage})
const {isLoggedin, validateFarmstock} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


router.get('/',  catchAsync(async(req, res) => {
    const farmstock = await FarmStock.find({})
    res.render('farmstock/index', {farmstock})
}));

router.get('/new', isLoggedin, (req, res) => {
    res.render('farmstock/new')
});

router.post('/', isLoggedin, upload.single('image'), validateFarmstock,  catchAsync( async (req, res) => {
  const farmstock = new FarmStock(req.body.farmstock)
    const {path, filename} = req.file
   farmstock.image = {url: path, filename: filename};
   
    await farmstock.save()
    res.redirect(`/farmstock/${farmstock._id}`)
}));

router.post('/:id/sold',    catchAsync( async (req, res) => {
  const {id} = req.params
   //const farmstock = await FarmStock.findByIdAndDelete(id)
  const farmstock = await FarmStock.findById(id)
  const { tag, name} = farmstock;
  const sales = new Income({
            income:` Sold ${tag}`,
            name: name,
  })
    
   await farmstock.delete(id)
    await sales.save()
    res.redirect('/farmstock')
}));

router.get('/:id',catchAsync( async (req, res) => {
    const {id} = req.params
    const farmstock = await FarmStock.findById(id)

    res.render('farmstock/show', {farmstock})
}))

router.get('/:id/edit', isLoggedin, catchAsync( async(req, res) => {
    const {id} = req.params
    const farmstock = await FarmStock.findById(id)
     res.render('farmstock/edit', {farmstock})
}))

router.put('/:id',  isLoggedin, upload.single('image'),  catchAsync( async(req, res) => {
     const {id} = req.params
   const farmstock = await FarmStock.findByIdAndUpdate(id, { ...req.body.farmstock });
   if(farmstock.image && req.file){
try{
    await cloudinary.uploader.destroy(farmstock.image.filename)
     const {path, filename} = req.file
   farmstock.image = {url: path, filename: filename};
} catch (err){
req.flash('error', err.message)
}
 }
 await farmstock.save()
  res.redirect(`/farmstock/${farmstock._id}`)
}));

router.delete('/:id', isLoggedin,  catchAsync( async(req, res) => {
     const {id} = req.params;
     const farmstock = await FarmStock.findByIdAndDelete(id)
     req.flash('success', 'Animal deleted successfully')
      res.redirect('/farmstock')
}))


module.exports = router