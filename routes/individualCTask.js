const express = require('express');

const router = express.Router({mergeParams: true});

const Crop = require('../models/crop')

const CTask = require('../models/cropTask')
const {isLoggedin, isAnAdmin, validateTask} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');




router.post('/', isLoggedin, isAnAdmin, validateTask, catchAsync( async (req, res) => {
     const {id} = req.params
    const crop = await Crop.findById(id)
    
   const task = new CTask(req.body.task)
   task.workers = req.body.workers;
   task.creator = req.user._id
   crop.tasks.push(task);
   
   await task.save()
   
   await crop.save()
   res.redirect(`/crop/${crop._id}`)
}));



router.delete('/:taskId', isLoggedin, isAnAdmin,  catchAsync( async(req, res) => {
     const {id, taskId} = req.params;
       await Crop.findByIdAndUpdate(id, { $pull: { events: taskId } });
    await CTask.findByIdAndDelete(taskId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/crop/${id}`)
}))








module.exports = router