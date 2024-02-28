// routes/protectedRoute.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const Bank = require('../models/Bank');


router.post('/refill', verifyToken, async (req, res) => {
    try { // Destructure userId directly
        const { solde } = req.body;

        // Find the user
        const user = await User.findOne({ _id: req.userId });

        // Find the bank record for the client
        let bank = await Bank.findOne({ 'client._id': user._id });

        if (bank) {
            // If bank record exists, update solde
            bank.solde += solde;
        } else {
            // If bank record doesn't exist, create a new one
            bank = new Bank({
                client: user,
                solde: solde || 1000000 // Set default value if solde is not provided
            });
        }

        // Save the bank record
        await bank.save();

        res.status(201).json(bank);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/user/:id', verifyToken, async (req, res) => {
    try { // Destructure userId directly


        // Find the user
        const user = await User.findOne({ _id: req.params.id });

        // Find the bank record for the client
        let bank = await Bank.findOne({ 'client._id': user._id });

        if (bank) {
            // If bank record exists, update solde
            res.status(200).json(bank);
        } else {
            // If bank record doesn't exist, create a new one
            bank = new Bank({
                client: user,
                solde: solde || 1000000 // Set default value if solde is not provided
            });

            // Save the bank record
            await bank.save();

            res.status(201).json(bank);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try { // Destructure userId directly


        // Find the user
        const user = await User.findOne({ _id: req.userId });
        console.log(user);
        // Find the bank record for the client
        let bank = await Bank.findOne({ 'client._id': user._id });

        if (bank) {
            // If bank record exists, update solde
            res.status(200).json(bank);
        } else {
            // If bank record doesn't exist, create a new one
            bank = new Bank({
                client: user,
                solde: solde || 1000000 // Set default value if solde is not provided
            });

            await bank.save();

            res.status(201).json(bank);
        }
        // Save the bank record
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;