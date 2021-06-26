const express = require('express');

const router = express.Router({mergeParams: true});

const Crop = require('../models/crop')

const cropEvent = require('../models/cropEvent')
const CTask = require('../models/cropTask')
const {isLoggedin, isAnAdmin, validateEvent} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');




router.post('/', isLoggedin, isAnAdmin, validateEvent, catchAsync( async (req, res) => {
     const {id} = req.params
    const crop = await Crop.findById(id)
    
   const event = new cropEvent(req.body.event)
   event.creator = req.user._id
   crop.events.push(event);
   
   await event.save()
   
   await crop.save()
   res.redirect(`/crop/${crop._id}`)
}));

router.post('/:taskId/complete', isLoggedin, isAnAdmin,   catchAsync( async (req, res) => {
  const {id, taskId} = req.params
   const crop = await Crop.findById(id)
  const foundTask = await CTask.findById(taskId)
  const {name, leader, workers, creator, task} = foundTask;
  const event = new cropEvent({
            event: task,
            name: name,
            date: Date.now(),
            creator: creator,
            leader: leader,
            note: `This event was completed by ${workers}`
  })
    
   await foundTask.delete(taskId)
     crop.events.push(event);
   
   await event.save()
   
   await crop.save()
     res.redirect(`/crop/${crop._id}`)
}));

router.delete('/:eventId', isLoggedin, isAnAdmin,  catchAsync( async(req, res) => {
     const {id, eventId} = req.params;
       await Crop.findByIdAndUpdate(id, { $pull: { events: eventId } });
    await cropEvent.findByIdAndDelete(eventId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/crop/${id}`)
}))

module.exports = router