const mongoose = require("mongoose");
const Lweight = require("./weight");
const Breeding = require("./breeding");
const Treatment = require("./treatment");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const BreederSchema = new Schema({
  tag: String, 
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
  creator: 
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  treatments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Treatment",
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
     await Treatment.deleteMany({
      _id: {
        $in: doc.treatments,
      },
    });
  
  }
  
});
BreederSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Breeder", BreederSchema);
