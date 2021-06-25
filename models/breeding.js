const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BreedingSchema = new Schema({
   
   exposedDate: Date,
   litterNo: Number,
   parturitionDate: Date,
  sire: String,
   creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
})

module.exports = mongoose.model('Breeding', BreedingSchema)