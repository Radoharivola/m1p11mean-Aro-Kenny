// routes/auth.js
const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
// User registration
router.post('/new', async (req, res) => {
    try {
        const { name } = req.body;
        const role = new Role({ name });
        await role.save();
        res.status(201).json({ message: 'role registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router; 