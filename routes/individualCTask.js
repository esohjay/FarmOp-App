const express = require('express');

const router = express.Router({mergeParams: true});

const Crop = require('../models/crop')
const Event = require('../models/cropEvent')
const CTask = require('../models/cropTask')
const {isLoggedin, validateTask} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');




router.post('/', isLoggedin, validateTask, catchAsync( async (req, res) => {
     const {id} = req.params
    const crop = await Crop.findById(id)
    
   const task = new CTask(req.body.task)
   crop.tasks.push(task);
   
   await task.save()
   
   await crop.save()
   res.redirect(`/crop/${crop._id}`)
}));



router.delete('/:taskId', isLoggedin,  catchAsync( async(req, res) => {
     const {id, taskId} = req.params;
       await Crop.findByIdAndUpdate(id, { $pull: { events: taskId } });
    await CTask.findByIdAndDelete(taskId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/crop/${id}`)
}))








module.exports = router