const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    expense: String,
    date: Date,
     name: String,
    amount: Number,
    note: String,

})

module.exports = mongoose.model('Expense', ExpenseSchema)