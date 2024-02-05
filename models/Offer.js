const mongoose = require('mongoose');
const offerSchema = new mongoose.Schema({
    services: { type: String, unique: true, required: true },
    dateDebut: { type: String, required: true },
    dateFin: { type: String, required: true },
    description: { type: String, required: true }
});
module.exports = mongoose.model('Offer', offerSchema);