const express = require('express');

const router = express.Router({mergeParams: true});
const Animal = require('../models/animal')



const Task = require('../models/task')
const {isLoggedin, validateTask} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');



router.post('/', isLoggedin, validateTask, catchAsync(async (req, res) => {
     const {id} = req.params
    const animal = await Animal.findById(id)
    
   const task = new Task(req.body.task)
   task.creator = req.user._id
   animal.tasks.push(task);
   
   await task.save()
   
   await animal.save()
   res.redirect(`/animal/${animal._id}`)
}));



router.delete('/:taskId', isLoggedin,  catchAsync(async(req, res) => {
     const {id, taskId} = req.params;
       await Animal.findByIdAndUpdate(id, { $pull: { tasks: taskId } });
    await Task.findByIdAndDelete(taskId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/animal/${id}`)
}))








module.exports = router