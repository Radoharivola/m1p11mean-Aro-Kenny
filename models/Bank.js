const mongoose = require('mongoose');
const bankSchema = new mongoose.Schema({
    client: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        phone: { type: String, required: true }
    },
    solde: { type: Number, default: 1000000, required: true },
});
module.exports = mongoose.model('Bank', bankSchema);