const mongoose = require('mongoose');
const Lweight = require('./weight');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
    
});

const BreederSchema = new Schema ({
   
    tag: String,
    breed: String,   
   
    sex: String,
    category: String,
    description: String,
    image: ImageSchema,
    dob: Date,
    sire: String,
    dam: String,
    farmstock: 
       [ {
            type: Schema.Types.ObjectId,
            ref: 'FarmStock'
        }]
    ,
    breeding: 
       [ {
            type: Schema.Types.ObjectId,
            ref: 'Breeding'
        }]
    ,
    lWeight: 
       [ {
            type: Schema.Types.ObjectId,
            ref: 'Lweight'
        }]
    ,

})
BreederSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        
        await Lweight.deleteMany({
            _id: {
                $in: doc.lWeight
            }
        });
        
    }
})

module.exports = mongoose.model('Breeder', BreederSchema)