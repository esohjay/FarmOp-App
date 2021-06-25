const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
  brand: String,
  createdAt: { type: Date, default: Date.now() },
  quantity: Number,
   creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});

module.exports = mongoose.model("Feed", FeedSchema);
