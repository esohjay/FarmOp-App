const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MortalitySchema =  new Schema({
    amount: Number,
    cause: String,
    date: Date
})

module.exports = mongoose.model('Mortality', MortalitySchema)