const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    price: { type: String, required: true },
    duration: { type: String, required: true },
    commission: { type: String, required: true },
    description: { type: String, required: true },
});
module.exports = mongoose.model('Service', serviceSchema);