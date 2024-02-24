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
const Jimp = require('jimp'); // Import Jimp for image processing
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ProfilePicture = require('../models/ProfilePicture');
const fs = require('fs');
const verifyToken = require('../middleware/authMiddleware');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage });

router.post('/register', upload.single('pic'), async (req, res) => {
    try {

        // Check if file uploaded successfully
        if (!req.file) {
            return res.status(404).json({ error: 'No file uploaded' });
        }

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

        const profilePictureFilename = req.file.filename;
        const outputPath = path.join('uploads/', profilePictureFilename);
        const image = await Jimp.read(req.file.path);
        await image.resize(200, 200).writeAsync(outputPath);

        const user = new User({
            username,
            password: hashedPassword,
            role: { roleId: foundRole._id, roleName: foundRole.name },
            lastName,
            firstName,
            email,
            phone
        });
        await user.save();

        const profilePicture = new ProfilePicture({
            userId: user._id,
            path: profilePictureFilename, // Store the filename in ProfilePicture model
            date: new Date()
        });
        await profilePicture.save();




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
        console.log(password);
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'User not found', username: username });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Password error' });
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '1h',
        });
        const serialized = cookie.serialize('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
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

// User logout
router.post('/logout', async (req, res) => {
    try {
        // Clear the authentication token stored in the client's browser
        const serialized = cookie.serialize('token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });

        // Set the cookie with an expired token
        res.setHeader('set-cookie', serialized);
        res.status(200).json({ message: serialized });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

router.post('/BOlogin', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(password);
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Employee/Manager not found', user: user });
        }
        if (user.role.roleName === 'client') {
            return res.status(401).json({ error: 'Employee/Manager not found', user: user });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Password error' });
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '1h',
        });
        const serialized = cookie.serialize('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });

        const userData = {
            username: user.username,
            email: user.email,
            role: user.role.roleName,
            token: token,
        };
        res.setHeader('set-cookie', serialized);
        res.status(200).json({ user: userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Update user route
router.put('/users/:userId', upload.single('pic'), verifyToken, async (req, res) => {
    try {

        // Check if file uploaded successfully
        if (!req.file) {
            return res.status(404).json({ error: 'No file uploaded' });
        }

        const userId = req.params.userId;
        const { username, password, role, firstName, lastName, email, phone } = req.body;
        const foundRole = await Role.findOne({ name: role });
        if (!foundRole) {
            return res.status(404).json({ error: 'Role not found' });
        }
        // Check if the user exists
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the new username already exists (excluding the current user)
        if (username !== existingUser.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(409).json({ error: 'Username already exists' });
            }
        }

        // Check if the new email already exists (excluding the current user)
        if (email !== existingUser.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(409).json({ error: 'Email already exists' });
            }
        }

        const pp = await ProfilePicture.findOne({ userId });
        console.log(pp.path)
        const profilePictureFilename = pp.path;
        const outputPath = path.join('uploads/', profilePictureFilename);
        const image = await Jimp.read(req.file.path);
        await image.resize(200, 200).writeAsync(outputPath);
        // Prepare update data
        const updateData = {
            username,
            role: { roleId: foundRole._id, roleName: foundRole.name },
            firstName,
            lastName,
            email,
            phone
        };

        const filenameToDelete = req.file.filename;

        const filePath = path.join('uploads/', filenameToDelete); // Assuming the file is located in the 'uploads' directory

        // Check if the file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File does not exist:', err);
                return;
            }

            // Delete the file
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return;
                }
                console.log('File deleted successfully');
            });
        });

        // Check if password needs to be updated
        if (password) {
            // Validate password strength
            if (!passwordSchema.validate(password)) {
                return res.status(400).json({ error: 'Password does not meet requirements' });
            }
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        // Respond with success message and updated user
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Update failed' });
    }
});


router.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the user exists
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the associated profile picture if it exists
        const profilePicture = await ProfilePicture.findOne({ userId });
        if (profilePicture) {
            const filePath = path.join('uploads/', profilePicture.path);

            // Check if the file exists
            fs.access(filePath, fs.constants.F_OK, async (err) => {
                if (!err) {
                    // Delete the file
                    try {
                        await fs.promises.unlink(filePath);
                        console.log('Profile picture deleted successfully');
                    } catch (unlinkErr) {
                        console.error('Error deleting profile picture:', unlinkErr);
                    }
                } else {
                    console.error('Profile picture file does not exist:', err);
                }
            });

            // Delete the profile picture document from the database
            await ProfilePicture.findOneAndDelete({ userId });
        }

        // Delete the user from the database
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Deletion failed' });
    }
});


module.exports = router; 