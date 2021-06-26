const express = require('express');

const router = express.Router({mergeParams: true});

const Crop = require('../models/crop')

const Expense = require('../models/cropExpense')
const Input = require('../models/input')
const {isLoggedin, isAnAdmin, validateInput} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');




router.post('/', isLoggedin, isAnAdmin, validateInput, catchAsync( async (req, res) => {
   const {id} = req.params
    const crop = await Crop.findById(id)
    const input = new Input(req.body.input)
    const expenses = new Expense({
        expense: input.inputName,
        date: input.date,
        amount: input.cost,
        name: input.name,
        note: `${input.quantity} of ${input.inputType} was used for this input`
    }) 
    input.creator = req.user._id;
    expenses.creator = req.user._id;
   crop.inputs.push(input);
   crop.expenses.push(expenses);
   
   await input.save()
   
   await expenses.save()
   await crop.save()
   res.redirect(`/crop/${crop._id}`)
}));



router.delete('/:iId', isLoggedin, isAnAdmin, catchAsync(async(req, res) => {
     const {id, iId} = req.params;
       await Crop.findByIdAndUpdate(id, { $pull: { inputs: iId } });
    await Input.findByIdAndDelete(iId);
    req.flash('success', 'Deleted successfully')
      res.redirect(`/crop/${id}`)
}))

module.exports = router