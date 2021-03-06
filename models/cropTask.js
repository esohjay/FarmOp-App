const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user')

const cTaskSchema = new Schema({
    task: String,
    startDate: Date,
    deadline: Date,
    workers: [],
    status: String,
    leader: String,
    instructions: String,
    name: String,
    staff: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

module.exports = mongoose.model('CTask', cTaskSchema)