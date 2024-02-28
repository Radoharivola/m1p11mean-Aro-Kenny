const mongoose = require('mongoose');
const prefServiceSchema = new mongoose.Schema({
    client: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        phone: { type: String, required: true }
    },
    service: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        name: { type: String },
        duration: { type: Number, required: true },
        price: { type: Number, required: true },
        commission: { type: Number, required: true },
        description: { type: String, required: true }
    },

});
module.exports = mongoose.model('PrefService', prefServiceSchema);

