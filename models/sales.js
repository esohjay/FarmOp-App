const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const SalesSchema = new Schema({
  amount: Number,
  name: String,
  tag: String,
  breed: String,
  sex: String,
  createdAt: { type: Date, default: Date.now() },
  description: String,
  batch: String,
  creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});
SalesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Sales", SalesSchema);
