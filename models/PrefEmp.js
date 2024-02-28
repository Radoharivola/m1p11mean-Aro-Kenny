const mongoose = require('mongoose');
const prefEmpSchema = new mongoose.Schema({
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

});
module.exports = mongoose.model('PrefEmp', prefEmpSchema);