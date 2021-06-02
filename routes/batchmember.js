const express = require("express");
const router = express.Router({ mergeParams: true });
const Animal = require("../models/animal");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const FarmStock = require("../models/farmstock");
const User = require("../models/user");
const {
  isLoggedin,
  validateFarmstock,
  validateLivestockEdit,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//Create new livestock
router.post(
  "/",
  upload.single("image"),
  validateFarmstock,
  catchAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const animal = await Animal.findById(id);
      const farmstock = new FarmStock(req.body.farmstock);
      farmstock.batch = animal.batch;
      const { path, filename } = req.file;
      farmstock.image = { url: path, filename: filename };
      animal.farmstock.push(farmstock);
      await farmstock.save();
      await animal.save();
      res.redirect(`/animal/${animal._id}`);
    } catch (err) {
      const {
        name,
        tag,
        category,
        sire,
        dam,
        breed,
        sex,
        productionStage,
        description,
        healthStatus,
      } = req.body.farmstock;
      let error = err.message;
      if (
        error.includes("duplicate") &&
        error.includes("index: tag_1 dup key")
      ) {
        req.flash("error", "Tag Number already exist");
        //error = 'Tag Number already exist'
        //res.redirect('/animal/new' , {name , batch, category, breed, quantity, source, description })
        res.redirect("back");
      }
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
