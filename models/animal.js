const mongoose = require('mongoose');
const Event = require('../models/event');
const Income = require('../models/income');
const Expense = require('../models/expense');
const Mortality = require('../models/mortality');
const Egg = require('../models/egg');
const Feed = require('../models/feed');
const Weight = require('../models/weight');
const Task = require('../models/task');
const FarmStock = require('../models/farmstock');
const Schema = mongoose.Schema;



const AnimalSchema = new Schema ({
     name: String,
     batch: String,
     breed: String,
    mortality: [{
        type: Schema.Types.ObjectId,
        ref: 'Mortality'
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
     farmstock: [{
        type: Schema.Types.ObjectId,
        ref: 'FarmStock'
    }],
    egg: [{
        type: Schema.Types.ObjectId,
        ref: 'Egg'
    }], 
    
    source: String,
    description: String,
    
    dateOfArrival: Date,
    quantity: Number,
    category: String,
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    
    expenses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Expense'
        }
    ],
    inflow: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Income'
        }
    ],
    feed: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Feed'
        }
    ],
    weight: 
       [ {
            type: Schema.Types.ObjectId,
            ref: 'Weight'
        }]
    ,

})

AnimalSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Event.deleteMany({
            _id: {
                $in: doc.events
            }
        });
        await Income.deleteMany({
            _id: {
                $in: doc.inflow
            }
        });
        await Task.deleteMany({
            _id: {
                $in: doc.task
            }
        });
        await Expense.deleteMany({
            _id: {
                $in: doc.expenses
            }
        });
        await Mortality.deleteMany({
            _id: {
                $in: doc.mortality
            }
        });
        await Egg.deleteMany({
            _id: {
                $in: doc.egg
            }
        });
        await Feed.deleteMany({
            _id: {
                $in: doc.feed
            }
        });
        await Weight.deleteMany({
            _id: {
                $in: doc.weight
            }
        });
         await FarmStock.deleteMany({
            _id: {
                $in: doc.farmstock
            }
        });
        
    }
})

module.exports = mongoose.model('Animal', AnimalSchema)