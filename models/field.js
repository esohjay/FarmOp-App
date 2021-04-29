const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FieldSchema = new Schema ({
    name: String,
    location: String,
    ownership: String,
    size: String,
    soilType: String
})

module.exports = mongoose.model('Field', FieldSchema)