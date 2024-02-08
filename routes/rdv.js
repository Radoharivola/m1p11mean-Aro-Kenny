var express = require('express');
var router = express.Router();
const WorkSchedule = require('../models/WorkSchedule');
const Rdv = require('../models/Rdv');
const User = require('../models/User');
const Service = require('../models/Service');

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
            var addedDate = new Date(startDate.getTime() + foundService.duration * 60000);


            const workSchedule = await WorkSchedule.findOne({ 'employee.employeeId': employee });
            const wsEndTime = new Date(workSchedule.endTime);
            wsEndTime.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

            const wsStartTime = new Date(workSchedule.startTime);
            wsStartTime.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

            // comparing the selected date to the employee's work schedule
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
            const result = await Rdv.findOne({
                // this old code is working but it won't allow like really close schedules like ending at 9am and starting at 9am
                // $or: [{date: { $lte: startDate },dateFin: { $gte: startDate }},{date: { $lte: addedDate },dateFin: { $gte: addedDate }},{$and: [{ date: { $gte: startDate } },{ dateFin: { $lte: addedDate } }] } ]
                // end

                $and: [
                    { 'employee.employeeId': employee },
                    {
                        $or: [
                            {
                                date: { $lte: startDate },
                                dateFin: { $gt: startDate }
                            },
                            {
                                date: { $lt: addedDate },
                                dateFin: { $gte: addedDate }
                            },
                            {
                                $and: [
                                    { date: { $gte: startDate } },
                                    { dateFin: { $lte: addedDate } }
                                ]
                            },
                            {
                                date: addedDate,
                                dateFin: startDate
                            }
                        ]
                    }
                ]

            }).limit(1);
            if (result) {
                return res.status(500).json({ message: "the selected date intersects with another rdv", rdv: result, selectedEmp: foundEmployee });
            }
            await rdv.save();
            return res.status(200).json({ message: "appointment scheduled", rdv: rdv });
        }else{
            
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'appointment creation failed' });
    }
});



module.exports = router;