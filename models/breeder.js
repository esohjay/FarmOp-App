const mongoose = require("mongoose");
const Lweight = require("./weight");
const Breeding = require("./breeding");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const BreederSchema = new Schema({
  tag: { type: String, unique: true },
  breed: String,
  name: String,
  sex: String,
  createdAt: { type: Date, default: Date.now() },
  category: String,
  description: String,
  image: ImageSchema,
  dob: Date,
  sire: String,
  dam: String,
  farmstock: [
    {
      type: Schema.Types.ObjectId,
      ref: "FarmStock",
    },
  ],
  breeding: [
    {
      type: Schema.Types.ObjectId,
      ref: "Breeding",
    },
  ],
  lWeight: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lweight",
    },
  ],
});
BreederSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Lweight.deleteMany({
      _id: {
        $in: doc.lWeight,
      },
    });
    await Breeding.deleteMany({
      _id: {
        $in: doc.breeding,
      },
    });
  }
});
BreederSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Breeder", BreederSchema);
