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

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const ws = await WorkSchedule.findOne({ 'employee.employeeId': id });
        if (!ws) {
            return res.status(404).json({ error: 'workschedule not found' });
        }
        const formattedWeeklySchedule = ws.weeklySchedule.map(schedule => {
            const startDateTime = new Date(schedule.startTime);
            const endDateTime = new Date(schedule.endTime);

            return {
                day: schedule.dayOfWeek,
                debutHour: startDateTime.getHours(), // Extract hour from startTime
                debutMin: startDateTime.getMinutes(),
                finHour: endDateTime.getHours(), // Extract hour from startTime
                finMin: endDateTime.getMinutes(), // Extract minute from startTime // Extract minute from startTime
                _id: schedule._id
                // Add other properties as needed
            };
        });

        return res.status(200).json({ id: ws._id, ws: formattedWeeklySchedule });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { weeklySchedule } = req.body;
        console.log(weeklySchedule);
        const ws = await WorkSchedule.findOne({ _id: id });
        if (!ws) {
            return res.status(404).json({ error: 'workschedule not found' });
        }


        // Process the weekly schedule
        const processedWeeklySchedule = weeklySchedule.map(schedule => {
            console.log(schedule);
            // Split the startTime and endTime strings into hours and minutes
            const startTimeParts = schedule.startTime.split(':');
            const endTimeParts = schedule.endTime.split(':');

            // Construct the Date objects with properly formatted time strings
            return {
                dayOfWeek: schedule.dayOfWeek,
                startTime: new Date(`1970-01-01T${padWithZeros(parseInt(startTimeParts[0]))}:${padWithZeros(parseInt(startTimeParts[1]))}:00`),
                endTime: new Date(`1970-01-01T${padWithZeros(parseInt(endTimeParts[0]))}:${padWithZeros(parseInt(endTimeParts[1]))}:00`)
            };
        });

        ws.weeklySchedule = processedWeeklySchedule;

        const updated = await WorkSchedule.findByIdAndUpdate(id, ws, { new: true });

        return res.status(200).json({ ws: updated });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

function padWithZeros(number) {
    return number < 10 ? '0' + number : '' + number;
}

module.exports = router; 