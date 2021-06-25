const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const TreatmentSchema = new Schema({
   dose: String,
   treatmentName: String,
   drug: String,
   note: String,
    date: Date,
    name: String,
    cost: Number,
    creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
})

TreatmentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Treatment', TreatmentSchema)