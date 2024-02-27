// routes/auth.js
const express = require('express');
const router = express.Router();
const Rdv = require('../models/Rdv');

const Depense = require('../models/Depense');
// User registration
router.post('/new', async (req, res) => {
    try {
        const {
            date,
            motif,
            price,
        } = req.body;

        const dateD = new Date(date).toISOString();
        const depense = new Depense({
            date: dateD,
            motif: motif,
            price: price
        });
        await depense.save();
        res.status(201).json({ message: 'depense registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.put('/update/:depenseId', async (req, res) => {
    try {
        const { date, motif, price } = req.body;
        const depenseId = req.params.depenseId;
        const dateU = new Date(date).toISOString();

        const updatedDepense = await Depense.findByIdAndUpdate(
            depenseId,
            {
                date: dateU,
                motif,
                price
            },
            { new: true }
        );

        if (!updatedDepense) {
            return res.status(404).json({ error: 'Depense not found' });
        }

        res.status(200).json({ message: 'Depense updated successfully', updatedDepense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Update failed' });
    }
});

router.delete('/delete/:depenseId', async (req, res) => {
    try {
        const depenseId = req.params.depenseId;

        const deletedDepense = await Depense.findByIdAndDelete(depenseId);

        if (!deletedDepense) {
            return res.status(404).json({ error: 'Depense not found' });
        }

        res.status(200).json({ message: 'Depense deleted successfully', deletedDepense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Deletion failed' });
    }
});





router.get('/achats', async (req, res, next) => {
    var achats = await Depense.find();
    //console.log(achats);
    return res.status(200).json({ achats });
});

router.get('/achats/:date', async (req, res, next) => {
    const dateToCheck = new Date(req.params.date).toISOString();
    console.log(dateToCheck);
    const achats = await Depense.find({
        $and: [
            { dateDebut: { $lte: dateToCheck } }, // Check if dateDebut is less than or equal to given date
            { dateFin: { $gte: dateToCheck } }    // Check if dateFin is greater than or equal to given date
        ]
    });
    return res.status(200).json({ achats });
});

router.get('/benefits-per-month/:year', async (req, res) => {
    const year = parseInt(req.params.year);

    try {
        // Initialize an array to store monthly benefits
        const monthlyBenefits = [];

        // Calculate revenue for each month
        const rdvs = await Rdv.find({
            $and: [
                { date: { $gte: new Date(`${year}-01-01`) } },
                { date: { $lte: new Date(`${year}-12-31`) } }
            ]
        });
        const monthlyRevenue = Array(12).fill(0);
        rdvs.forEach(rdv => {
            const month = rdv.date.getMonth();
            const netRevenue = rdv.services.reduce((total, service) => total + (service.price - (service.commission * service.price / 100)), 0);
            monthlyRevenue[month] += netRevenue;
        });

        // Calculate expenses for each month
        const depenses = await Depense.find({
            $and: [
                { date: { $gte: `${year}-01-01` } },
                { date: { $lte: `${year}-12-31` } }
            ]
        });
        console.log(depenses);
        const monthlyExpenses = Array(12).fill(0);
        depenses.forEach(depense => {
            const month = new Date(depense.date).getMonth();
            console.log(new Date(depense.date));
            monthlyExpenses[month] += depense.price; // Add expenses
        });

        // Calculate total benefit for each month
        for (let i = 0; i < 12; i++) {
            console.log(monthlyExpenses[i]);
            const totalBenefit = monthlyRevenue[i] - monthlyExpenses[i];
            monthlyBenefits.push({ month: i + 1, benefits: totalBenefit });
        }

        // Return the monthly benefits
        res.status(200).json({ year, monthlyBenefits });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 