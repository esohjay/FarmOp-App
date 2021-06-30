const mongoose = require("mongoose");
const cropEvent = require("../models/cropEvent");
const cropIncome = require("../models/cropIncome");
const cropExpense = require("../models/cropExpense");
const Input = require("../models/input");
const CTask = require("../models/cropTask");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;


const CropSchema = new Schema({
  crop: String,
  variety: String,
  field: String,
  date: Date,
  createdAt: { type: Date, default: Date.now() },
  description: String,
  image: String,
  coverage: String,
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: "cropEvent",
    },
  ],
   creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  inputs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Input",
    },
  ],
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: "cropExpense",
    },
  ],
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "CTask",
    },
  ],
  inflow: [
    {
      type: Schema.Types.ObjectId,
      ref: "cropIncome",
    },
  ],
});

CropSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await cropEvent.deleteMany({
      _id: {
        $in: doc.events,
      },
    });
    await Input.deleteMany({
      _id: {
        $in: doc.inputs,
      },
    });
    await cropIncome.deleteMany({
      _id: {
        $in: doc.inflow,
      },
    });
    await cropExpense.deleteMany({
      _id: {
        $in: doc.expenses,
      },
    });
    await CTask.deleteMany({
      _id: {
        $in: doc.tasks,
      },
    });
  }
});
CropSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Crop", CropSchema);
