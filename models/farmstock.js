const mongoose = require("mongoose");
const Lweight = require("./weight");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;
const Treatment = require("./treatment");
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const FarmStockSchema = new Schema({
  tag: String,
  breed: String,
  name: String,
  sex: String,

  description: String,
  image: ImageSchema,
  dob: Date,
  category: String,
  batch: String,
  productionStage: String,
  healthStatus: String,
  sire: String,
  dam: String,
  createdAt: { type: Date, default: Date.now() },
   creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  lWeight: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lweight",
    },
  ],
  treatments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Treatment",
    },
  ],
});
FarmStockSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Lweight.deleteMany({
      _id: {
        $in: doc.lWeight,
      },
    });
    await Treatment.deleteMany({
      _id: {
        $in: doc.treatments,
      },
    });
  }
});
FarmStockSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("FarmStock", FarmStockSchema);
