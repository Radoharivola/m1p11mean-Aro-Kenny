// routes/auth.js
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
// User registration
router.post('/new', async (req, res) => {
    try {
        const {
            name,
            price, 
            duration,
            commission, 
            description } = req.body;
        const service = new Service({
            name,
            price, 
            duration,
            commission, 
            description
        });
        await service.save();
        res.status(201).json({ message: 'service registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.put('/update/:serviceId', async (req, res) => {
    try {
        const { name, duration, description } = req.body;
        const serviceId = req.params.serviceId;

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            {
                name,
                duration,
                description
            },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json({ message: 'Service updated successfully', updatedService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Update failed' });
    }
});

router.delete('/delete/:serviceId', async (req, res) => {
    try {
        const serviceId= req.params.serviceId;

        const deletedService = await Service.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json({ message: 'Service deleted successfully', deletedService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Deletion failed' });
    }
});


router.get('/services', async (req, res, next) => {
    var services = await Service.find();
    return res.status(200).json({ services });
});

module.exports = router; 