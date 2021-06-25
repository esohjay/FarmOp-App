const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const InputSchema = new Schema({
   quantity: String,
   inputName: String,
   inputType: String,
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

InputSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Input', InputSchema)