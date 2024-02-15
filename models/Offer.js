const mongoose = require('mongoose');
const offerSchema = new mongoose.Schema({
    services: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        name: { type: String },
        duration: { type: Number, required: true },
        price: { type: Number, required: true },
        commission: { type: Number, required: true },
        description: { type: String, required: true }
    }],
    dateDebut: { type: String, required: true },
    dateFin: { type: String, required: true },
    description: { type: String, required: true },
    reduction: { type: Number, required: true}
});
module.exports = mongoose.model('Offer', offerSchema);