const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/user");
const mongoosePaginate = require("mongoose-paginate-v2");
const TaskSchema = new Schema({
  task: String,
  startDate: Date,
  deadline: Date,
  workers: { type: Array, trim: true },
  status: String,
  leader: String,
  priority: String,
  createdAt: { type: Date, default: Date.now() },
  instructions: String,
   creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  name: String,
});
TaskSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Task", TaskSchema);
