// routes/auth.js
const express = require('express');
const router = express.Router();
const Offer= require('../models/Offer')
// User registration
router.post('/new', async (req, res) => {
    try {
        const {
            services,
            dateDebut,
            dateFin,
            description,
            reduction
        } = req.body;

        const dateD=new Date(dateDebut).toISOString();
        const dateF=new Date(dateFin).toISOString();
        const offer = new Offer({
            services,
            dateDebut: dateD,
            dateFin: dateF,
            description,
            reduction
        });
        await offer.save();
        res.status(201).json({ message: 'offer registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.get('/offers', async (req, res, next) => {
    var offers = await Offer.find();
    return res.status(200).json({ offers });
});

router.get('/offers/:date', async (req, res, next) => {
    const dateToCheck = new Date(req.params.date).toISOString();
    console.log(dateToCheck);
    const offers = await Offer.find({
        $and: [
            { dateDebut: { $lte: dateToCheck } }, // Check if dateDebut is less than or equal to given date
            { dateFin: { $gte: dateToCheck } }    // Check if dateFin is greater than or equal to given date
        ]
    });
    return res.status(200).json({ offers });
});

module.exports = router; 