const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const deadAnimalsSchema = new Schema({
  cause: String,
  name: String,
  Tag: String,
  breed: String,
  sex: String,
  createdAt: { type: Date, default: Date.now() },
  description: String,
  batch: String,
});
module.exports = mongoose.model("DeadOnes", deadAnimalsSchema);
