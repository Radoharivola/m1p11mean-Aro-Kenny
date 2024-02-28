const mongoose = require('mongoose');

const workScheduleSchema = new mongoose.Schema({
    employee: {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the 'User' model
            required: true
        },
        employeeLastName: { type: String, required: true },
        employeeFirstName: { type: String, required: true }
    },
    weeklySchedule: [
        {
            dayOfWeek: { type: String, required: true },
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true }
        }
    ]
});

module.exports = mongoose.model('WorkSchedule', workScheduleSchema);
