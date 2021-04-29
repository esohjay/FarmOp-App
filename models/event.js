const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    event: String,
    date: Date,
    leader: String,
    note: String,
    name: String
})

module.exports = mongoose.model('Event', EventSchema)