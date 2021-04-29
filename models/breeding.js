const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BreedingSchema = new Schema({
   
   exposedDate: Date,
   litterNo: Number,
   parturitionDate: Date,
  sire: String
})

module.exports = mongoose.model('Breeding', BreedingSchema)