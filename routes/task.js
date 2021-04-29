const express = require('express');

const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Event = require('../models/event')
const Task = require('../models/task')
const User = require('../models/user')
const {isLoggedin, validateTask, validateTaskEdit} = require('../middleware')

router.get('/', isLoggedin, catchAsync(async(req, res) => {
    const tasks = await Task.find({})
    res.render('task/index', {tasks})
}));
router.get('/new', isLoggedin, catchAsync(async (req, res) => {
    const staff = await User.find({});
    
    res.render('task/new', {staff})
}));
router.post('/', isLoggedin, validateTask, catchAsync( async (req, res) => {
   const task = new Task(req.body.task)
   await task.save()
   res.redirect(`/task/${task._id}`)
}));
router.get('/:id', isLoggedin, catchAsync(async (req, res) => {
    const {id} = req.params
    const task = await Task.findById(id).populate('staff')
    const staff = await User.find({});
     if(!task){
        req.flash('error', 'No task found')
        return res.redirect('/task')
    }
    res.render('task/show', {task, staff})
}))
router.get('/:id/edit', isLoggedin, catchAsync(async(req, res) => {
    const {id} = req.params
     const staff = await User.find({});
    const task = await Task.findById(id)
    res.render('task/edit', {task, staff})
}))

router.post('/:id/complete',    catchAsync( async (req, res) => {
  const {id} = req.params
  
  const foundTask = await Task.findById(id)
  const {name, leader, workers, task} = foundTask;
  const event = new Event({
            event: task,
            name: name,
            date: Date.now(),
            leader: leader,
            note: `This event was completed by ${workers}`
  })
    
   await foundTask.delete(id)
    await event.save()
    res.redirect(`/event/${event._id}`)
}));
router.put('/:id', isLoggedin, validateTaskEdit, catchAsync(async(req, res) => {
     const {id} = req.params
   const task = await Task.findByIdAndUpdate(id, { ...req.body.task });
   await task.save()
   res.redirect(`/task/${task._id}`)
}));
router.delete('/:id', isLoggedin,  catchAsync(async(req, res) => {
     const {id} = req.params;
      const task = await Task.findByIdAndDelete(id)
      res.redirect('/task')
}))








module.exports = router