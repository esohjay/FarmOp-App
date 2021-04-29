const mongoose = require('mongoose');
const Lweight = require('./weight');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
    
});

const FarmStockSchema = new Schema ({
   
    tag: String,
    breed: String,   
    name: String,
    sex: String,
    
    description: String,
    image: ImageSchema,
    dob: Date,
    category: String,
    productionStage: String,
    healthStatus: String,
    sire: String,
    dam: String,
    
    
   
  
    lWeight: 
       [ {
            type: Schema.Types.ObjectId,
            ref: 'Lweight'
        }]
    ,

})
FarmStockSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        
        await Lweight.deleteMany({
            _id: {
                $in: doc.lWeight
            }
        });
        
    }
})

module.exports = mongoose.model('FarmStock', FarmStockSchema)