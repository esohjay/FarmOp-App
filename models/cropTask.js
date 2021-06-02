const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/user");
const mongoosePaginate = require("mongoose-paginate-v2");
const cTaskSchema = new Schema({
  task: String,
  startDate: Date,
  deadline: Date,
  workers: [],
  status: String,
  leader: String,
  instructions: String,
  createdAt: { type: Date, default: Date.now() },
  name: String,
  staff: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
cTaskSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("CTask", cTaskSchema);
