const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const FieldSchema = new Schema({
  name: String,
  location: String,
  ownership: String,
  size: String,
  createdAt: { type: Date, default: Date.now() },
  soilType: String,
});
FieldSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Field", FieldSchema);
