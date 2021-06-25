const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const IncomeSchema = new Schema({
  income: String,
  name: String,
  date: Date,
  amount: Number,
  note: String,
  createdAt: { type: Date, default: Date.now() },
   creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});
IncomeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Income", IncomeSchema);
