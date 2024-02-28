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
            console.log(req.body);
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
        //console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.put('/update/:serviceId', async (req, res) => {
    try {
        const { name, duration, price, commission, description } = req.body;
        const serviceId = req.params.serviceId;

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            {
                name,
                price, 
                duration,
                commission, 
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

router.get('/service/:id', async (req, res, next) => {
    try {
      // Attempt to find the employee by ID
      const service = await Service.findOne({ _id: req.params.id });
  
      // If employee is not found, return a 404 status
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
  
      // If employee is found, return it with a 200 status
      return res.status(200).json({ service });
    } catch (error) {
      // If there's an error, return a 500 status with the error message
      return res.status(500).json({ error: error.message });
    }
  });

module.exports = router; 