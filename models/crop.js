const mongoose = require('mongoose');
const cropEvent = require('../models/cropEvent')
const cropIncome = require('../models/cropIncome')
const cropExpense = require('../models/cropExpense')
const CTask = require('../models/cropTask')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
const CropSchema = new Schema ({
    crop: String,
    variety: String,
    field: String,
    date: Date,
    description: String,
    image: ImageSchema,
    coverage: String,
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'cropEvent'
        }
    ],
    expenses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'cropExpense'
        }
    ],
     tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'CTask'
        }
    ],
    inflow: [
        {
            type: Schema.Types.ObjectId,
            ref: 'cropIncome'
        }
    ]
})

CropSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await cropEvent.deleteMany({
            _id: {
                $in: doc.events
            }
        });
        await cropIncome.deleteMany({
            _id: {
                $in: doc.inflow
            }
        });
        await cropExpense.deleteMany({
            _id: {
                $in: doc.expenses
            }
        });
        await CTask.deleteMany({
            _id: {
                $in: doc.tasks
            }
        });
    }
})

module.exports = mongoose.model('Crop', CropSchema)