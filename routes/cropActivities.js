const express = require('express');

const router = express.Router();

const User = require('../models/user')
const Crop = require('../models/crop')

const cropEvent = require('../models/cropEvent')
const {isLoggedin, validateEvent} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


router.get('/', catchAsync(async(req, res) => {
    const events = await cropEvent.find({})
    res.render('cropevent/index', {events})
}));
router.get('/new', isLoggedin,  catchAsync(async (req, res) => {
    const user = await User.find({});
     const crop = await Crop.find({});
    res.render('cropevent/new', {user, crop})
}));

router.post('/', isLoggedin, validateEvent, catchAsync( async (req, res) => {
      const event = new cropEvent(req.body.event);
   await event.save()
   res.redirect(`/cropevent/${event._id}`)
}));

router.get('/:id',catchAsync( async (req, res) => {
    const {id} = req.params
    const event = await cropEvent.findById(id);
   
    res.render('cropevent/show', {event})
}))
router.get('/:id/edit', isLoggedin,  catchAsync(async(req, res) => {
    const {id} = req.params
    const event = await cropEvent.findById(id)
    const user = await User.find({});
    const crop = await Crop.find({});
    res.render('cropevent/edit', {event, user, crop})
}))
router.put('/:id', isLoggedin, validateEvent, catchAsync( async(req, res) => {
     const {id} = req.params
   const event = await cropEvent.findByIdAndUpdate(id, { ...req.body.event });
   await event.save()
   res.redirect(`/cropevent/${event._id}`)
}));

router.delete('/:eventId', isLoggedin,  catchAsync(async(req, res) => {
     const { eventId} = req.params;
      
    await cropEvent.findByIdAndDelete(eventId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/event`)
}))









module.exports = router