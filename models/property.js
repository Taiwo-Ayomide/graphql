const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const propertySchema = new Schema({
    numOfBed: { type: Number, required: true },
    numOfBath: { type: Number, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    imageUrl: { type: String, required: true },
    state: { type: String, required: true },
    rentType: { type: String, required: true },
});
  

module.exports = moongoose.model('Property', propertySchema);