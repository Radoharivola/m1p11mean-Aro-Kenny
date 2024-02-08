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
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        serviceName: { type: String },
        serviceDuration: { type: Number, required: true }
    }],
    date: { type: Date, required: true },
    dateFin: { type: Date, required: true },

});
module.exports = mongoose.model('Rdv', rdvSchema);