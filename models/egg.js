const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EggSchema = new Schema({
    quantity: Number,
    date: Date
})

module.exports = mongoose.model('Egg', EggSchema)