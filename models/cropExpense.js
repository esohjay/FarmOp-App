const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const cropExpenseSchema = new Schema({
  expense: String,
  date: Date,
 
  amount: Number,
  name: String,
  createdAt: { type: Date, default: Date.now() },
  note: String,
  creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});
cropExpenseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("cropExpense", cropExpenseSchema);
