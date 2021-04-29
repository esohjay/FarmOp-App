const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user')

const TaskSchema = new Schema({
    task: String,
    startDate: Date,
    deadline: Date,
    workers: Array,
    status: String,
    leader: String,
    instructions: String,
    staff: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
     name: String
})

module.exports = mongoose.model('Task', TaskSchema)