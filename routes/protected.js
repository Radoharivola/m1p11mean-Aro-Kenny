// routes/protectedRoute.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');

const nodemailer = require('nodemailer');
const Offer = require('../models/Offer');
// const User = require('../models/User');

// Protected route
router.get('/', verifyToken, async (req, res) => {
    const user = await User.find({ _id: req.userId });
    res.status(200).json({ message: 'Protected route accessed', user, id: req.userId });
});


router.get('/mail', async (req, res) => {
    try {

        let transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 587,
            secure: false,
            auth: {
                user: 'renyudark@zohomail.com',
                pass: 'Gofuckurself420!!'
            }
        });

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'renyudark@zohomail.com',
            to: 'renyudark@gmail.com',
            subject: 'subject',
            text: 'body'
        });

        console.log('Email sent:', info.messageId);
        res.status(200).json({ message: 'Protected route accessed' });
    } catch (err) {
        res.status(500).json({ err });
    }
});

router.get('/offer', async (req, res) => {
    try {
        // Set time to beginning of the day

        try {
            // Find offers for today
            const dateToCheck = new Date().toISOString();

            const offers = await Offer.find({
                $and: [
                    { dateDebut: { $lte: dateToCheck } }, // Check if dateDebut is less than or equal to given date
                    { dateFin: { $gte: dateToCheck } }    // Check if dateFin is greater than or equal to given date
                ]
            });
            console.log(offers);
            if (offers.length === 0) {
                console.log('No offers available for today.');
                return;
            }

            // Find clients with role 'client'
            // const clients = await User.find({ 'role.roleName': 'client' });
            // console.log(clients);
            // Send email to each client
            // clients.forEach(async (client) => {
            offers.forEach(async (offer) => {
                let string = '';
                offer.services.forEach(service => {
                    string += '<li>' + service.name + '</li>';
                });

                const htmlContent = `<h1>${offer.description}</h1><p>Réduction de ${offer.reduction}% pour les services suivants:</p><ul>${string}</ul>`;

                try {
                    await sendEmail('renyudark@gmail.com', 'Offre spéciale', htmlContent);
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            });
            // });
        } catch (error) {
            console.error('Error checking offers:', error);
        }
        res.status(200).json({ message: 'Protected route accessed' });
    } catch (err) {
        res.status(500).json({ err });
    }
});

async function sendEmail(to, subject, body) {
    // Configure nodemailer with your email service details
    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: {
            user: 'renyudark@zohomail.com',
            pass: 'Gofuckurself420!!'
        }
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'renyudark@zohomail.com',
        to: to,
        subject: subject,
        html: body
    });

    console.log('Email sent:', info.messageId);
}

module.exports = router;