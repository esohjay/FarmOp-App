const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
    income: String,
     name: String,
    date: Date,
    amount: Number,
    note: String,

})

module.exports = mongoose.model('Income', IncomeSchema)