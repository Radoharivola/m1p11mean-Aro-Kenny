// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(2) // Must have at least 2 digits
    .has().not().spaces(); // Should not have spaces

// old User registration with no control
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password, role, firstName, lastName, email, phone } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ username: username, password: hashedPassword, role: role, lastName: lastName, firstName: firstName, email: email, phone: phone });
//         await user.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Registration failed' });
//     }
// });

router.post('/register', async (req, res) => {
    try {
        const { username, password, role, firstName, lastName, email, phone } = req.body;
        const foundRole = await Role.findOne({ name: role });
        if (!foundRole) {
            return res.status(400).json({ error: 'Role not found' });
        }
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Validate password strength
        if (!passwordSchema.validate(password)) {
            return res.status(400).json({ error: 'Password does not meet requirements' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new User({
            username,
            password: hashedPassword,
            role: { roleId: foundRole._id, roleName: foundRole.name },
            lastName,
            firstName,
            email,
            phone
        });

        // Save the user to the database
        await user.save();

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '1h',
        });
        const serialized = cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });

        const userData = {
            username: user.username,
            email: user.email,
        };
        res.setHeader('set-cookie', serialized);
        res.status(200).json({ user: userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router; 