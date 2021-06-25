const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const deadAnimalsSchema = new Schema({
  cause: String,
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
deadAnimalsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("DeadOnes", deadAnimalsSchema);
