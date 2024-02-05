const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role', // Reference to the 'Role' model
            required: true
        },
        roleName: { type: String, required: true }
    },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true }
});

// async function validateRole(value) {


//     // const Service = mongoose.model('Service');

//     // const serviceCount = await Service.countDocuments({ _id: { $in: value } });

//     // return serviceCount === value.length;


//     const role = mongoose.model('Role');

//     // Convert service name to lowercase for case-insensitive comparison
//     const lowercasedName = value.name.toLowerCase();

//     const existingService = await role.find({ name: lowercasedName }, 'name');

//     // Check if the service name exists
//     return !!existingService;
// }

module.exports = mongoose.model('User', userSchema);