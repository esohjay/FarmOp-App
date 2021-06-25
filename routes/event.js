const express = require('express');

const router = express.Router({mergeParams: true});
const Animal = require('../models/animal')




const Event = require('../models/event')
const Task = require('../models/task')
const {isLoggedin, validateEvent} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');



router.post('/', isLoggedin, validateEvent, catchAsync(async (req, res) => {
     const {id} = req.params
    const animal = await Animal.findById(id)
    
   const event = new Event(req.body.event)
   event.creator = req.user._id
   animal.events.push(event);
   
   await event.save()
   
   await animal.save()
   res.redirect(`/animal/${animal._id}`)
}));

router.post('/:taskId/complete',    catchAsync( async (req, res) => {
  const {id, taskId} = req.params
  const animal = await Animal.findById(id)
  const foundTask = await Task.findById(taskId)
  const {name, leader, workers, task} = foundTask;
  const event = new Event({
            event: task,
            name: name,
            date: Date.now(),
            leader: leader,
            note: `This event was completed by ${workers}`
  })
    
   await foundTask.delete(taskId)
    animal.events.push(event);
   
   await event.save()
   
   await animal.save()
    res.redirect(`/animal/${animal._id}`)
}));


router.delete('/:eventId', isLoggedin,  catchAsync(async(req, res) => {
     const {id, eventId} = req.params;
       await Animal.findByIdAndUpdate(id, { $pull: { events: eventId } });
    await Event.findByIdAndDelete(eventId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/animal/${id}`)
}))








module.exports = router