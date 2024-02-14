const mongoose = require('mongoose');
const rdvSchema = new mongoose.Schema({
    client: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        phone: { type: String, required: true }
    },
    employee: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        phone: { type: String, required: true }
    },
    services: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        name: { type: String },
        duration: { type: Number, required: true },
        price: { type: Number, required: true },
        commission: { type: Number, required: true },
        description: { type: String, required: true }
    }],
    total: { type: Number, required: true },
    paid: { type: Number, required: true },
    date: { type: Date, required: true },
    dateFin: { type: Date, required: true },

});
module.exports = mongoose.model('Rdv', rdvSchema);