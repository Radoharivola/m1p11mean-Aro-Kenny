// routes/auth.js
const express = require('express');
const router = express.Router();
const WorkSchedule = require('../models/WorkSchedule');
const User = require('../models/User');
// User registration
router.post('/new', async (req, res) => {
    try {
        const { employee, weeklySchedule } = req.body;
        const foundEmployee = await User.findOne({ _id: employee, 'role.roleName': 'employee' });
        if (!foundEmployee) {
            return res.status(400).json({ error: 'employee not found' });
        }
        const foundWs = await WorkSchedule.findOne({ 'employee.employeeId': foundEmployee._id });
        if (foundWs) {
            return res.status(400).json({ error: 'Ws already registered' });
        }

        const processedWeeklySchedule = weeklySchedule.map(schedule => {
            return {
                ...schedule,
                startTime: new Date(`1970-01-01T${schedule.startTime}`),
                endTime: new Date(`1970-01-01T${schedule.endTime}`)
            };
        });
        const workSchedule = new WorkSchedule({
            employee: {
                employeeId: foundEmployee._id,
                employeeFirstName: foundEmployee.firstName,
                employeeLastName: foundEmployee.lastName,
            },
            weeklySchedule: processedWeeklySchedule
        });
        await workSchedule.save();
        res.status(201).json({ foundEmployee });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router; 