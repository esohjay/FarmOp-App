const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cropIncomeSchema = new Schema({
    income: String,
    date: Date,
    name: String,
    image: String,
    amount: Number,
    note: String,

})

module.exports = mongoose.model('cropIncome', cropIncomeSchema)