var express = require('express');
var router = express.Router();
const WorkSchedule = require('../models/WorkSchedule');
const Rdv = require('../models/Rdv');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');
// const Service = require('../models/Service');

router.post('/new', verifyToken, async (req, res) => {
    try {
        //in the next update client will be replaced req.userId user the protected route
        const { employee, services, date, total, paid } = req.body;
        const client = req.userId;
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

            const startDate = new Date(date);
            const addedDate = new Date(startDate.getTime() + sumOfDurations * 60000);

            // Find the employee's work schedule
            const workSchedule = await WorkSchedule.findOne({ 'employee.employeeId': employee });
            console.log(workSchedule);

            // Find the relevant day's schedule based on the day of the week of the given date
            const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][startDate.getDay()];
            const daySchedule = workSchedule.weeklySchedule.find(schedule => schedule.dayOfWeek === dayOfWeek);

            if (!daySchedule) {
                return res.status(409).json({ message: "Employee does not work on this day" });
            }

            const wsEndTime = new Date(daySchedule.endTime);
            wsEndTime.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

            const wsStartTime = new Date(daySchedule.startTime);
            wsStartTime.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

            // comparing the selected date to the employee's work schedule for the specific day
            if (addedDate > wsEndTime || startDate < wsStartTime) {
                return res.status(409).json({ message: "Outside of the employee's working hours" });
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
                    _id: foundEmployee._id,
                    firstName: foundEmployee.firstName,
                    lastName: foundEmployee.lastName,
                    email: foundEmployee.email,
                    phone: foundEmployee.phone
                },
                services: services,
                date: startDate,
                dateFin: addedDate,
                total: total,
                paid: paid,
                done: false,
                emailed: false
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
            const result = await Rdv.find({
                $and: [
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

            });
            const employeeIds = result.map(rdv => rdv.employee._id);
            const employeesNotInRdv = await User.find({
                _id: { $nin: employeeIds },
                'role.roleName': 'employee'
            });
            if (employeesNotInRdv.length === 0) {
                return res.status(409).json({ message: "Aucun employé disponible" });
            }
            const found = employeesNotInRdv[0];
            const rdv = new Rdv({
                client: {
                    _id: foundClient._id,
                    firstName: foundClient.firstName,
                    lastName: foundClient.lastName,
                    email: foundClient.email,
                    phone: foundClient.phone
                },
                employee: {
                    _id: found._id,
                    firstName: found.firstName,
                    lastName: found.lastName,
                    email: found.email,
                    phone: found.phone
                },
                services: services,
                date: startDate,
                dateFin: addedDate,
                total: total,
                paid: paid,
                done: false,
                emailed: false
            });
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
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'appointment creation failed' });
    }
});

router.get('/:dateInit/:dateFin/:limit/:page/:dateSort', verifyToken, async (req, res) => {
    try {
        const page = req.params.page || 1;
        const limit = parseInt(req.params.limit) || 10;
        const skip = (page - 1) * limit;

        //in the next update client will be replaced req.userId user the protected route
        const clientId = req.userId;

        const formattedDate = new Date().toISOString();

        const dateOnly = formattedDate.split('T')[0];
        const foundClient = await User.findOne({ _id: clientId });
        console.log(foundClient);
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

router.get('/emp/:dateInit/:dateFin/:limit/:page/:dateSort', verifyToken, async (req, res) => {
    try {
        const done = req.query.done;
        const page = req.params.page || 1;
        const limit = parseInt(req.params.limit) || 10;
        const skip = (page - 1) * limit;

        //in the next update client will be replaced req.userId user the protected route
        const empId = req.userId;

        const formattedDate = new Date().toISOString();

        const dateOnly = formattedDate.split('T')[0];

        const dateSort = 1 * req.params.dateSort;

        const totalRdvs = await Rdv.countDocuments({
            'employee._id': empId,
            date: { $gte: new Date(req.params.dateInit), $lt: new Date(req.params.dateFin) },
        });

        const totalPages = Math.ceil(totalRdvs / limit);

        const rdvs = await Rdv.find({
            'employee._id': empId,
            done: done,
            date: { $gte: new Date(req.params.dateInit), $lt: new Date(req.params.dateFin) },
        }).sort({ date: dateSort }).skip(skip).limit(limit);

        return res.status(200).json({ rdvs, totalPages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
});


router.put('/:rdvId', verifyToken, async (req, res) => {
    try {
        const rdvId = req.params.rdvId;
        const data = req.body;
        console.log(data);

        const updatedRdv = await Rdv.findByIdAndUpdate(rdvId, data, { new: true });

        res.status(200).json({ message: 'Rdv updated', updatedRdv });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Deletion failed' });
    }
});

router.delete('/rdvs/:rdvId', async (req, res) => {
    try {
        const rdvId = req.params.rdvId;
        console.log(rdvId);
        // Check if the user exists
        const existingRdv = await Rdv.findById(rdvId);
        if (!existingRdv) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user from the database
        await Rdv.findByIdAndDelete(rdvId);

        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Deletion failed' });
    }
});


router.get('/:rdvId', async (req, res) => {
    try {
        const rdvId = req.params.rdvId;
        console.log(rdvId);
        // Check if the user exists
        const rdv = await Rdv.findById(rdvId);
        if (!rdv) {
            return res.status(404).json({ error: 'rd not found' });
        }

        res.status(200).json({ rdv });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Deletion failed' });
    }
});

router.get('/stat/:year/:month?', async (req, res) => {
    const { year, month } = req.params;

    // Convert year to an integer
    const yearInt = parseInt(year);

    // Check if year is a valid integer
    if (isNaN(yearInt)) {
        return res.status(400).json({ error: 'Invalid year' });
    }

    try {
        if (month) {
            // If month is specified, return appointment counts for each day of the specified month
            const monthInt = parseInt(month);

            // Check if month is a valid integer
            if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
                return res.status(400).json({ error: 'Invalid month' });
            }

            // Calculate the number of days in the specified month
            const daysInMonth = new Date(yearInt, monthInt, 0).getDate();

            // Initialize an array to store appointment counts for each day
            const appointmentsCounts = [];

            // Loop through each day of the month
            for (let day = 1; day <= daysInMonth; day++) {
                // Calculate the start and end dates for the current day
                const startDate = new Date(yearInt, monthInt - 1, day);
                const endDate = new Date(yearInt, monthInt - 1, day, 23, 59, 59);

                // Query appointments for the current day
                const appointmentsCount = await Rdv.countDocuments({
                    date: { $gte: startDate, $lte: endDate }
                });

                // Add the appointment count for the current day to the array
                appointmentsCounts.push({ day, appointmentsCount });
            }

            // Return the list of appointment counts for each day of the month
            res.json({ year: yearInt, month: monthInt, appointmentsCounts });
        } else {
            // If month is not specified, return appointment counts for each month of the year
            const appointmentsCountsByMonth = [];

            // Loop through each month of the year
            for (let month = 1; month <= 12; month++) {
                const daysInMonth = new Date(yearInt, month, 0).getDate();

                // Calculate the start and end dates for the current month
                const startDate = new Date(yearInt, month - 1, 1);
                const endDate = new Date(yearInt, month - 1, daysInMonth, 23, 59, 59);

                // Query appointments for the current month
                const appointmentsCount = await Rdv.countDocuments({
                    date: { $gte: startDate, $lte: endDate }
                });

                // Add the appointment count for the current month to the array
                appointmentsCountsByMonth.push({ month, appointmentsCount });
            }

            // Return the list of appointment counts for each month of the year
            res.json({ year: yearInt, appointmentsCountsByMonth });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/ca/:year/:month?', async (req, res) => {
    const { year, month } = req.params;

    // Convert year to an integer
    const yearInt = parseInt(year);

    // Check if year is a valid integer
    if (isNaN(yearInt)) {
        return res.status(400).json({ error: 'Invalid year' });
    }

    try {
        if (month) {
            // If month is specified, return turnover for each day of the specified month
            const monthInt = parseInt(month);

            // Check if month is a valid integer
            if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
                return res.status(400).json({ error: 'Invalid month' });
            }

            // Calculate the number of days in the specified month
            const daysInMonth = new Date(yearInt, monthInt, 0).getDate();

            // Initialize an array to store turnover for each day
            const turnoverByDay = [];

            // Loop through each day of the month
            for (let day = 1; day <= daysInMonth; day++) {
                // Calculate the start and end dates for the current day
                const startDate = new Date(yearInt, monthInt - 1, day);
                const endDate = new Date(yearInt, monthInt - 1, day, 23, 59, 59);

                // Query appointments for the current day
                const appointments = await Rdv.find({
                    date: { $gte: startDate, $lte: endDate }
                });

                // Calculate the turnover for the current day
                const dailyTurnover = appointments.reduce((total, appointment) => {
                    return total + appointment.total - appointment.paid;
                }, 0);

                // Add the turnover for the current day to the array
                turnoverByDay.push({ day, dailyTurnover });
            }

            // Return the list of turnover for each day of the month
            res.json({ year: yearInt, month: monthInt, turnoverByDay });
        } else {
            // If month is not specified, return turnover for each month of the year
            const turnoverByMonth = [];

            // Loop through each month of the year
            for (let month = 1; month <= 12; month++) {
                const daysInMonth = new Date(yearInt, month, 0).getDate();

                // Calculate the start and end dates for the current month
                const startDate = new Date(yearInt, month - 1, 1);
                const endDate = new Date(yearInt, month - 1, daysInMonth, 23, 59, 59);

                // Query appointments for the current month
                const appointments = await Rdv.find({
                    date: { $gte: startDate, $lte: endDate }
                });

                // Calculate the turnover for the current month
                const monthlyTurnover = appointments.reduce((total, appointment) => {
                    return total + appointment.total - appointment.paid;
                }, 0);

                // Add the turnover for the current month to the array
                turnoverByMonth.push({ month, monthlyTurnover });
            }

            // Return the list of turnover for each month of the year
            res.json({ year: yearInt, turnoverByMonth });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;