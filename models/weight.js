const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WeightSchema = new Schema({
   date: {type: Date, default: Date.now()},
   weight: {type: Number, default: 0},
   initWeight: Number
})

module.exports = mongoose.model('Weight', WeightSchema)