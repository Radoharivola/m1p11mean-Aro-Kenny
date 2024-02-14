var express = require('express');
var router = express.Router();
const WorkSchedule = require('../models/WorkSchedule');
const Rdv = require('../models/Rdv');
const User = require('../models/User');
// const Service = require('../models/Service');

router.post('/new', async (req, res) => {
    try {
        //in the next update client will be replaced req.userId user the protected route
        const { client, employee, services, date, total, paid } = req.body;
        const foundClient = await User.findOne({ _id: client });
        if (!foundClient) {
            return res.status(400).json({ error: 'Client not found' });
        }
        // const foundService = await Service.findOne({ _id: service });
        // if (!foundService) {
        //     return res.status(400).json({ error: 'service not found' });
        // }
        const foundEmployee = await User.findOne({ _id: employee });
        if (foundEmployee) {
            const sumOfDurations = services.reduce((total, service) => total + service.duration, 0);

            var startDate = new Date(date);
            var addedDate = new Date(startDate.getTime() + sumOfDurations * 60000);


            const workSchedule = await WorkSchedule.findOne({ 'employee.employeeId': employee });
            const wsEndTime = new Date(workSchedule.endTime);
            wsEndTime.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

            const wsStartTime = new Date(workSchedule.startTime);
            wsStartTime.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

            // comparing the selected date to the employee's work schedule
            if (addedDate > wsEndTime || startDate < wsStartTime) {
                return res.status(409).json({ message: "En dehors des horaires de travail de l'employé" });
            }
            const rdv = new Rdv({
                client: {
                    _id: foundClient._id,
                    firstName: foundClient.firstName,
                    lastName: foundClient.lastName,
                    email: foundClient.email,
                    phone: foundClient.phone
                },
                employee: {
                    _id: foundClient._id,
                    firstName: foundClient.firstName,
                    lastName: foundClient.lastName,
                    email: foundClient.email,
                    phone: foundClient.phone
                },
                services: services,
                date: startDate,
                dateFin: addedDate,
                total: total,
                paid: paid,
            });
            const result = await Rdv.findOne({
                // this old code is working but it won't allow like really close schedules like ending at 9am and starting at 9am
                // $or: [{date: { $lte: startDate },dateFin: { $gte: startDate }},{date: { $lte: addedDate },dateFin: { $gte: addedDate }},{$and: [{ date: { $gte: startDate } },{ dateFin: { $lte: addedDate } }] } ]
                // end

                $and: [
                    { 'employee._id': employee },
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
                return res.status(409).json({ message: "Cet employé n'est pas disponible pour cette date.", rdv: result, selectedEmp: foundEmployee });
            }
            const result1 = await Rdv.findOne({
                // this old code is working but it won't allow like really close schedules like ending at 9am and starting at 9am
                // $or: [{date: { $lte: startDate },dateFin: { $gte: startDate }},{date: { $lte: addedDate },dateFin: { $gte: addedDate }},{$and: [{ date: { $gte: startDate } },{ dateFin: { $lte: addedDate } }] } ]
                // end

                $and: [
                    { 'client._id': client },
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
            if (result1) {
                return res.status(409).json({ message: "Vous avez déja un rendez-vous prévu pour cette date.", rdv: result, selectedEmp: foundEmployee });
            }
            await rdv.save();

            return res.status(200).json({ message: "Rendez-vous programmé!", rdv: rdv });
        } else {
            // return res.status(409).json({ message: "no emp"});
            const sumOfDurations = services.reduce((total, service) => total + service.duration, 0);

            var startDate = new Date(date);
            var addedDate = new Date(startDate.getTime() + sumOfDurations * 60000);
            const rdv = new Rdv({
                client: {
                    _id: foundClient._id,
                    firstName: foundClient.firstName,
                    lastName: foundClient.lastName,
                    email: foundClient.email,
                    phone: foundClient.phone
                },
                services: services,
                date: startDate,
                dateFin: addedDate,
                total: total,
                paid: paid,
            });
            await rdv.save();

            return res.status(200).json({ message: "Rendez-vous programmé!", rdv: rdv });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'appointment creation failed' });
    }
});

router.get('/:clientId/:dateInit/:dateFin/:limit/:page/:dateSort', async (req, res) => {
    try {
        const page = req.params.page || 1;
        const limit = parseInt(req.params.limit) || 10;
        const skip = (page - 1) * limit;

        //in the next update client will be replaced req.userId user the protected route
        const clientId = req.params.clientId;
        const formattedDate = new Date().toISOString();

        const dateOnly = formattedDate.split('T')[0];
        const foundClient = await User.findOne({ _id: clientId });
        if (!foundClient) {
            return res.status(400).json({ error: 'Client not found' });
        }
        const dateSort = 1 * req.params.dateSort;
        // old one 
        // const rdvs = await Rdv.find({
        //     'client._id': clientId,
        //     date: { $gte: new Date(), $lt: new Date(dateOnly).setDate(new Date(dateOnly).getDate() + 1) },
        // }).sort({ date: dateSort }).limit(req.params.limit);
        //end
        const totalRdvs = await Rdv.countDocuments({
            'client._id': clientId,
            date: { $gte: new Date(req.params.dateInit), $lt: new Date(req.params.dateFin) },
        });

        const totalPages = Math.ceil(totalRdvs / limit);

        const rdvs = await Rdv.find({
            'client._id': clientId,
            date: { $gte: new Date(req.params.dateInit), $lt: new Date(req.params.dateFin) },
        }).sort({ date: dateSort }).skip(skip).limit(limit);

        return res.status(200).json({ rdvs, totalPages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
});



module.exports = router;