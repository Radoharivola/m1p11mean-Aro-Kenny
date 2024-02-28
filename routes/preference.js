// routes/protectedRoute.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const PrefEmp = require('../models/PrefEmp');
const PrefService = require('../models/PrefService');

router.get('/my-pref-emps', verifyToken, async (req, res) => {
    const prefEmps = await PrefEmp.find({ 'client._id': req.userId });
    if (!prefEmps) {
        res.status(404).json({ error: 'Aucune préférence trouvée' });
    }
    res.status(200).json({ prefEmps });
});
router.get('/my-pref-services', verifyToken, async (req, res) => {
    const prefServices = await PrefService.find({ 'client._id': req.userId });
    if (!prefServices) {
        res.status(404).json({ error: 'Aucune préférence trouvée' });
    }
    res.status(200).json({ prefServices });
});
router.post('/update-pref-emp', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        const { employee } = req.body;
        const exist = await PrefEmp.findOne({ 'client._id': user._id, 'employee._id': employee._id });
        if (exist) {
            await PrefEmp.findByIdAndDelete(exist._id);
            res.status(200).json({ message: 'deleted!' });

        } else {

            const newPref = new PrefEmp({
                client: user,
                employee: employee
            });
            await newPref.save();
            res.status(200).json({ message: 'saved!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }

});
router.post('/update-pref-service', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        const { service } = req.body;
        const exist = await PrefService.findOne({ 'client._id': user._id, 'service._id': service._id });
        if (exist) {
            await PrefService.findByIdAndDelete(exist._id);
            res.status(200).json({ message: 'deleted!' });

        } else {
            // console.log(user);
            const newPref = new PrefService({
                client: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                },
                service: {
                    _id: service._id,
                    name: service.name,
                    duration: service.duration,
                    price: service.price,
                    commission: service.commission,
                    description: service.description
                }
            });
            // // console.log(service);
            await newPref.save();
            res.status(200).json({ message: 'saved!',newPref,user });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }

});
router.get('/test', async (req, res) => {

    res.status(200).json({ message: "hello" });
});

module.exports = router;