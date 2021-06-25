const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const cropEventSchema = new Schema({
  event: String,
  date: Date,
  leader: String,
  note: String,
  createdAt: { type: Date, default: Date.now() },
  name: String,
  creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});
cropEventSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("cropEvent", cropEventSchema);
