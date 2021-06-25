const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Animal = require("../models/animal")

const Breeder = require("../models/breeder")
const Breeding = require("../models/breeding")
const Crop = require("../models/crop")
const cropEvent = require("../models/cropEvent")
const cropExpense = require("../models/cropExpense")
const cropIncome = require("../models/cropIncome")
const cropTask = require("../models/cropTask")
const deadAnimals = require("../models/deadAnimals")
const Egg = require("../models/egg")
const Events = require("../models/event")
const Expenses = require("../models/expense")
const Farmstock = require("../models/farmstock")
const Feed = require("../models/feed")
const Field = require("../models/field")
const Income = require("../models/income")
const Input = require("../models/input")
const Mortality = require("../models/mortality")
const Sales = require("../models/sales")
const Task = require("../models/task")
const Treatment = require("../models/treatment")
const Weight = require("../models/weight")
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  fname: String,
  lname: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  isAdmin: { type: Boolean, default: false },
  sex: String,
  role: String,
  roleDescription: String,
  farmId:{
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resetPasswordToken: String,
	resetPasswordExpires: Date
});

UserSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    
    await Animal.deleteMany({
      creator : doc._id
    });
    await Breeder.deleteMany({
      creator : doc._id
    });
    await Breeding.deleteMany({
      creator : doc._id
    });
    await Crop.deleteMany({
      creator : doc._id
    });
    await cropEvent.deleteMany({
      creator : doc._id
    });
    await cropExpense.deleteMany({
      creator : doc._id
    });
    await cropIncome.deleteMany({
      creator : doc._id
    });
    await cropTask.deleteMany({
      creator : doc._id
    });
    await deadAnimals.deleteMany({
      creator : doc._id
    });
    await Egg.deleteMany({
      creator : doc._id
    });
    await Events.deleteMany({
      creator : doc._id
    });
    await Expenses.deleteMany({
      creator : doc._id
    });
    await Farmstock.deleteMany({
      creator : doc._id
    });
    await Feed.deleteMany({
      creator : doc._id
    });
    await Field.deleteMany({
      creator : doc._id
    });
    await Income.deleteMany({
      creator : doc._id
    });
    await Input.deleteMany({
      creator : doc._id
    });
    await Mortality.deleteMany({
      creator : doc._id
    });
    await Sales.deleteMany({
      creator : doc._id
    });
    await Task.deleteMany({
      creator : doc._id
    });
    await Treatment.deleteMany({
      creator : doc._id
    });
    await Weight.deleteMany({
      creator : doc._id
    });
    
  }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
