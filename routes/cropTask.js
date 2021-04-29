const express = require('express');

const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const CTask = require('../models/cropTask')
const Event = require('../models/cropEvent')
const User = require('../models/user')
const Crop = require('../models/crop')
const {isLoggedin, validateTask, validateTaskEdit} = require('../middleware')

router.get('/', isLoggedin, catchAsync(async(req, res) => {
    const tasks = await CTask.find({})
    res.render('cropTask/index', {tasks})
}));
router.get('/new', isLoggedin, catchAsync(async (req, res) => {
    const staff = await User.find({});
    const crop = await Crop.find({});
    
    res.render('cropTask/new', {staff, crop})
}));
router.post('/', isLoggedin, validateTask, catchAsync( async (req, res) => {
   const task = new CTask(req.body.task)
   await task.save()
   res.redirect(`/croptask/${task._id}`)
}));
router.get('/:id', isLoggedin, catchAsync(async (req, res) => {
    const {id} = req.params
    const task = await CTask.findById(id).populate('staff')
    const staff = await User.find({});
     if(!task){
        req.flash('error', 'No task found')
        return res.redirect('/croptask')
    }
    res.render('cropTask/show', {task, staff})
}))
router.get('/:id/edit', isLoggedin, catchAsync(async(req, res) => {
    const {id} = req.params
     const staff = await User.find({});
    const task = await CTask.findById(id)
    res.render('cropTask/edit', {task, staff})
}))
router.post('/:id/complete',    catchAsync( async (req, res) => {
  const {id} = req.params
  
  const foundTask = await CTask.findById(id)
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
     res.redirect(`/cropevent/${event._id}`)
}));
router.put('/:id', isLoggedin, validateTaskEdit, catchAsync(async(req, res) => {
     const {id} = req.params
   const task = await CTask.findByIdAndUpdate(id, { ...req.body.task });
   await task.save()
   res.redirect(`/croptask/${task._id}`)
}));
router.delete('/:id', isLoggedin,  catchAsync(async(req, res) => {
     const {id} = req.params;
      const task = await CTask.findByIdAndDelete(id)
      res.redirect('/croptask')
}))








module.exports = router