// routes/auth.js
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
// User registration
router.post('/new', async (req, res) => {
    try {
        const {
            name,
            // price, 
            duration,
            // commission, 
            description } = req.body;
        const service = new Service({
            name,
            // price, 
            duration,
            // commission, 
            description
        });
        await service.save();
        res.status(201).json({ message: 'service registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router; 