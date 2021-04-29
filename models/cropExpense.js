const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cropExpenseSchema = new Schema({
    expense: String,
    date: Date,
    image: String,
    amount: Number,
    name: String,
    note: String
})

module.exports = mongoose.model('cropExpense', cropExpenseSchema)