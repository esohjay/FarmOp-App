const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const cropIncomeSchema = new Schema({
  income: String,
  date: Date,
  name: String,
  image: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now() },
  note: String,
});
cropIncomeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("cropIncome", cropIncomeSchema);
