var express = require('express');
var router = express.Router();
const WorkSchedule = require('../models/WorkSchedule');
const Rdv = require('../models/Rdv');
const User = require('../models/User');
const Service = require('../models/Service');

/* GET home page. */
router.post('/new', async (req, res) => {
    try {
        const { client, employee, service, date } = req.body;
        const foundClient = await User.findOne({ _id: client });
        if (!foundClient) {
            return res.status(400).json({ error: 'Client not found' });
        }
        const foundService = await Service.findOne({ _id: service });
        if (!foundService) {
            return res.status(400).json({ error: 'service not found' });
        }
        const foundEmployee = await User.findOne({ _id: employee });
        if (foundEmployee) {
            var startDate = new Date(date);
            var addedDate = new Date(startDate.getTime() + foundService.duration * 60000); // 1 minute = 60000 milliseconds


            const workSchedule = await WorkSchedule.findOne({ 'employee.employeeId': employee });
            const wsEndTime = new Date(workSchedule.endTime);
            wsEndTime.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

            const wsStartTime = new Date(workSchedule.startTime);
            wsStartTime.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

            const bool = addedDate > wsEndTime;
            if (addedDate > wsEndTime || startDate < wsStartTime) {
                return res.status(500).json({ error: 'en dehors de ses horaires de travail' });
            }

            const rdv = new Rdv({
                client: {
                    clientId: foundClient._id,
                    clientFirstName: foundClient.firstName,
                    clientLastName: foundClient.lastName,
                },
                employee: {
                    employeeId: foundEmployee._id,
                    employeeFirstName: foundEmployee.firstName,
                    employeeLastName: foundEmployee.lastName,
                },
                service: {
                    serviceId: foundService._id,
                    serviceName: foundService.name,
                    serviceDuration: foundService.duration,
                },
                date: startDate,
                dateFin: addedDate
            });

            // await rdv.save();
            // return res.status(200).json({ startDate, addedDate, bool });
            const formattedDate = new Date(addedDate).toISOString();
            const dateOnly = formattedDate.split('T')[0];
            const rdvs = await Rdv.find({ 'employee.employeeId': employee, date: { $gte: new Date(dateOnly), $lt: new Date(dateOnly).setDate(new Date(dateOnly).getDate() + 1) } })
            return res.status(200).json({rdvs});

            
        }




        res.status(200).json("ehehehehe appointment");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'appointment creation failed' });
    }
});



module.exports = router;