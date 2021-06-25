const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MortalitySchema = new Schema({
  amount: Number,
  cause: String,
  createdAt: { type: Date, default: Date.now() },
  date: Date,
  creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});

module.exports = mongoose.model("Mortality", MortalitySchema);
