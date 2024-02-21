const mongoose = require('mongoose');
const profilePictureSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the 'Role' model
        required: true
    },
    path: { type: String, unique: true, required: true },
    date: { type: String, required: true }
});

module.exports = mongoose.model('ProfilePicture', profilePictureSchema);