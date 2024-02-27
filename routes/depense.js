// routes/auth.js
const express = require('express');
const router = express.Router();
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

// router.get('/achats/:date', async (req, res, next) => {
//     const dateToCheck = new Date(req.params.date).toISOString();
//     console.log(dateToCheck);
//     const achats = await Depense.find({
//         $and: [
//             { dateDebut: { $lte: dateToCheck } }, // Check if dateDebut is less than or equal to given date
//             { dateFin: { $gte: dateToCheck } }    // Check if dateFin is greater than or equal to given date
//         ]
//     });
//     return res.status(200).json({ achats });
// });

router.get('/achats/:id', async (req, res, next) => {
    try {
      // Attempt to find the employee by ID
      const achat = await Depense.findOne({ _id: req.params.id });
  
      // If employee is not found, return a 404 status
      if (!achat) {
        return res.status(404).json({ error: 'Service not found' });
      }
  
      // If employee is found, return it with a 200 status
      return res.status(200).json({ achat });
    } catch (error) {
      // If there's an error, return a 500 status with the error message
      return res.status(500).json({ error: error.message });
    }
  });

module.exports = router; 