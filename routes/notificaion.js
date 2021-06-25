const express = require('express');

const router = express.Router({mergeParams: true});

const Income = require('../models/income')
const Expense = require('../models/expense')
const cropExpense = require('../models/cropExpense')
const cropIncome = require('../models/cropIncome')
const cropEvent = require('../models/cropEvent')
const Event = require('../models/event')
const Task = require('../models/task')
const CTask = require('../models/cropTask')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedin } = require('../middleware');



router.get("/", isLoggedin, catchAsync(async (req, res) => {

    const tasks = await Task.find({creator: req.user.farmId})
let notificationInfo = []
    for(let task of tasks){
         const startDate = task.startDate  
        const deadline = task.deadline
const dateDiff = Date.parse(startDate) - Date.now();
const deadlineDiff = Date.parse(deadline) - Date.now();

const startDaysLeft = Math.round(dateDiff/86400000)
const deadlineDaysLeft = Math.round(deadlineDiff/86400000)
const info = {name: task.task, dateDiff: dateDiff, deadlineDiff: deadlineDiff, startDaysLeft: startDaysLeft, deadlineDaysLeft: deadlineDaysLeft,  startDate: startDate, deadline: deadline}
     notificationInfo.push(info)
    }
   
   res.render("notification/index", {tasks, notificationInfo})
}) )

router.get('/finance', isLoggedin, catchAsync(async (req, res) => {
    const livestockIncome  = await Income.find({});
    const livestockExpenses = await Expense.find({});
     const cropExpenses = await cropExpense.find({})
     const cropInflow = await cropIncome.find({})
    
    res.render('report/financeIndex', {livestockIncome, livestockExpenses, cropExpenses, cropInflow});
}))

router.get('/finance/crop', isLoggedin, catchAsync(async (req, res) => {
     const cropExpenses = await cropExpense.find({})
     const cropInflow = await cropIncome.find({})
    res.render('report/crop/financeIndex', {cropExpenses, cropInflow});
}))

router.get('/finance/livestock', isLoggedin, catchAsync(async (req, res) => {
    const livestockIncome  = await Income.find({});
    const livestockExpenses = await Expense.find({});
    res.render('report/livestock/financeIndex', {livestockIncome, livestockExpenses});
}))

router.get('/finance/livestock/:id',catchAsync( async (req, res) => {
    const {id} = req.params
     const livestockIncome = await Income.findById(id)
    res.render('report/livestock/incomeShow', { livestockIncome})
}))
router.get('/finance/livestocks/:id',catchAsync( async (req, res) => {
    const {id} = req.params
    const livestockExpenses = await Expense.findById(id)
    
    res.render('report/livestock/expenseShow', {livestockExpenses})
}))

router.get('/finance/crop/:id',catchAsync( async (req, res) => {
    const {id} = req.params
     const cropInflow = await cropIncome.findById(id)
    res.render('report/crop/incomeShow', { cropInflow})
}))
router.get('/finance/crops/:id',catchAsync( async (req, res) => {
    const {id} = req.params
    const cropExpenses = await cropExpense.findById(id)
    
    res.render('report/crop/expenseShow', {cropExpenses})
}))

router.get('/activities', isLoggedin, catchAsync(async (req, res) => {
    const livestockEvents  = await Event.find({});
     const cropEvents = await cropEvent.find({})
    res.render('report/activityIndex', {livestockEvents,  cropEvents});
}))

router.get('/activities/livestock', isLoggedin, catchAsync(async (req, res) => {
    const livestockEvents  = await Event.find({});
    res.render('report/livestock/index', {livestockEvents});
}))

router.get('/activities/crop', isLoggedin, catchAsync(async (req, res) => {
     const cropEvents = await cropEvent.find({})
    res.render('report/crop/index', {cropEvents});
}))

router.get('/activities/crop/:id',catchAsync( async (req, res) => {
    const {id} = req.params
   
     const cropEvents = await cropEvent.findById(id)
    res.render('report/crop/show', { cropEvents})
}))
router.get('/activities/livestock/:id',catchAsync( async (req, res) => {
    const {id} = req.params;
    const livestockEvents = await Event.findById(id)
    
    res.render('report/livestock/show', {livestockEvents})
}))

module.exports = router;