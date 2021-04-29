const mongoose = require('mongoose');

const Lweight = require('../models/weight');
const Breeding = require('../models/breeding');
const FarmStock = require('../models/farmstock');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
    
});

const LivestockSchema = new Schema ({
    
    tag: String,
    breed: String,
   
    breeding: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Breeding'
        }
    ],   
    farmstock: [
        {
            type: Schema.Types.ObjectId,
            ref: 'FarmStock'
        }
    ],   
    age: String,
    sex: String,
    
    description: String,
    image: ImageSchema,
    dateOfArrival: Date,
    
    productionStage: String,
    healthStatus: String,
   
    mortality: [{
        type: Schema.Types.ObjectId,
        ref: 'Mortality'
    }],
    
    lWeight: 
       [ {
            type: Schema.Types.ObjectId,
            ref: 'Lweight'
        }]
    ,

})

LivestockSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        
        await Lweight.deleteMany({
            _id: {
                $in: doc.lWeight
            }
        });
        await Breeding.deleteMany({
            _id: {
                $in: doc.breeding
            }
        });
       /**  await FarmStock.deleteMany({
            _id: {
                $in: doc.farmstock
            }
        }); */
    }
})

module.exports = mongoose.model('Livestock', LivestockSchema)