const mongoose = require('mongoose');
const rdvSchema = new mongoose.Schema({
    client: {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        clientName: { type: String }
    },
    employee: {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        employeeName: { type: String }
    },
    service: {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        serviceName: { type: String }
    },
    date: { type: String, required: true },
});
module.exports = mongoose.model('Rdv', rdvSchema);