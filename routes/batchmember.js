const express = require("express");
const router = express.Router({ mergeParams: true });
const Animal = require("../models/animal");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const FarmStock = require("../models/farmstock");

const {
  isLoggedin,
  validateFarmstock,
  
} = require("../middleware");
const {setImage} = require("../utils/logics")
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//Create new livestock
router.post(
  "/", isLoggedin,
  upload.single("image"),
  validateFarmstock,
  catchAsync(async (req, res) => {
    
      const { id } = req.params;
      const animal = await Animal.findById(id);
      const farmstock = new FarmStock(req.body.farmstock);
      farmstock.batch = animal.batch;
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
        animal.farmstock.push(farmstock);
      await farmstock.save();
      await animal.save();
       res.redirect(`/animal/${animal._id}`);
      }
   })
);

router.get(
  "/:bId",
  catchAsync(async (req, res) => {
    const { bId, id } = req.params;
    const animal = await Animal.findById(id);
    const farmstock = await FarmStock.findById(bId).populate("breeding");
    res.render("farmstock/show", { farmstock, animal });
  })
);

/*router.put('/:lId',  isLoggedin, upload.single('image'), validateLivestockEdit, catchAsync( async(req, res) => {
     const {id, lId} = req.params;
    const animal = await Animal.findById(id)
   const livestock = await Livestock.findByIdAndUpdate(lId, { ...req.body.livestock });
   if(livestock.image && req.file){
try{
    await cloudinary.uploader.destroy(livestock.image.filename)
     const {path, filename} = req.file
   livestock.image = {url: path, filename: filename};
} catch (err){
req.flash('error', err.message)
}
 }
 await livestock.save()
   res.redirect(`/animal/${animal._id}`)
}));


router.delete('/:lId', isLoggedin,  catchAsync( async(req, res) => {
     const {id, lId} = req.params;
      
     const animal = await Animal.findByIdAndUpdate(id, {$pull: {livestock: lId}})
     const livestock = await Livestock.findByIdAndDelete(lId);
     
     if(livestock.image){
try{
    await cloudinary.uploader.destroy(livestock.image.filename)
 } catch (err){
req.flash('error', err.message)
}
   }
       req.flash('success', 'Livestock deleted successfully')
     res.redirect(`/animal/${animal._id}`)
}))*/

module.exports = router;
