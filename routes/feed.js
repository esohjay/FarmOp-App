const express = require('express');
const router = express.Router({mergeParams: true});
const Animal = require('../models/animal')
const {isLoggedin, validateFeed} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Feed = require('../models/feed');





router.post('/', isLoggedin, validateFeed, catchAsync( async (req, res) => {
   const {id} = req.params
    const animal = await Animal.findById(id)
    const feedGiven= new Feed(req.body.feed)
    feedGiven.creator = req.user._id
   animal.feed.push(feedGiven);
   
   await feedGiven.save()
   
   await animal.save()
   res.redirect(`/animal/${animal._id}`)
}));


router.delete('/:fId', isLoggedin, catchAsync( async(req, res) => {
     const {id, fId} = req.params;
       await Animal.findByIdAndUpdate(id, { $pull: { feed: fId } });
    await Feed.findByIdAndDelete(fId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/animal/${id}`)
}))


module.exports = router