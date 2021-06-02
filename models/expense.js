const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const ExpenseSchema = new Schema({
  expense: String,
  date: Date,
  name: String,
  amount: Number,
  note: String,
  createdAt: { type: Date, default: Date.now() },
});
ExpenseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Expense", ExpenseSchema);
