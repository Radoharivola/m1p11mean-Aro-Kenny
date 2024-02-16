const mongoose = require('mongoose');
const depenseSchema = new mongoose.Schema({
    date: { type: String, required: true },
    motif: { type: String, required: true },
    price: { type: Number, required: true },
});
module.exports = mongoose.model('Depense', depenseSchema);