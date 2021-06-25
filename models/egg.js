const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EggSchema = new Schema({
    quantity: Number,
    date: Date,
     creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
})

module.exports = mongoose.model('Egg', EggSchema)