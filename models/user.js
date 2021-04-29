const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    fname: String,
    lname: String,
     email: {
        type: String,
        required: true,
        unique: true
    },
   phone: Number,
   confirmPW: String
})
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)