const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
    brand: String,
    quantity: Number
})

module.exports = mongoose.model('Feed', FeedSchema)