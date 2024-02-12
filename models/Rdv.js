const mongoose = require('mongoose');
const rdvSchema = new mongoose.Schema({
    client: {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        clientFirstName: { type: String, required: true },
        clientLastName: { type: String, required: true }
    },
    employee: {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        employeeFirstName: { type: String },
        employeeLastName: { type: String }
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