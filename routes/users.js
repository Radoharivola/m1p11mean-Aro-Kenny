var express = require('express');
var router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');
const ProfilePicture = require('../models/ProfilePicture');
const fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
  return res.status(200).json({ message: "users router" });
});

// router.get('/employees', async (req, res, next) => {
//   var employees = await User.find({ 'role.roleName': 'employee' })
//   return res.status(200).json({ employees });
// });

router.get('/employees', verifyToken, async (req, res, next) => {
  const searchString = req.query.searchString; // Assuming the search string is passed as a query parameter
  const sortBy = req.query.sortBy || 'name'; // Default sorting by name if sortBy parameter is not provided
  const sortOrder = 1 * req.query.sortOrder ? -1 : 1; // Sort order, defaulting to ascending
  let query = { 'role.roleName': 'employee' };

  // If search string is provided, construct the query to search by name, firstname, lastname, or email
  if (searchString) {
    query.$or = [
      { name: { $regex: searchString, $options: 'i' } }, // Case-insensitive regex search for name
      { firstname: { $regex: searchString, $options: 'i' } }, // Case-insensitive regex search for firstname
      { lastname: { $regex: searchString, $options: 'i' } }, // Case-insensitive regex search for lastname
      { email: { $regex: searchString, $options: 'i' } },
      { phone: { $regex: searchString, $options: 'i' } } // Case-insensitive regex search for email
    ];
  }

  try {
    // Find employees matching the query and sort the results
    const employees = await User.find(query).sort({ [sortBy]: sortOrder });

    // Send response with the found employees
    return res.status(200).json({ employees });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/employee/:id', verifyToken, async (req, res, next) => {
  try {
    // Attempt to find the employee by ID
    const employee = await User.findOne({ _id: req.params.id });

    // If employee is not found, return a 404 status
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }


    // Find the corresponding profile picture for the user
    var profilePicture = await ProfilePicture.findOne({ userId: employee._id });
    // If profile picture is found
    if (profilePicture) {
      // Read the file data

      const imageData = fs.readFileSync(`uploads/${profilePicture.path}`);
      // Convert the file data to base64
      const base64Image = Buffer.from(imageData).toString('base64');
      // Add the base64 string to the employee object
      profilePicture = base64Image;
    }


    // If employee is found, return it with a 200 status
    return res.status(200).json({ employee, profilePicture });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.get('/emp/profile', verifyToken, async (req, res, next) => {
  try {
    // Attempt to find the employee by ID
    const employee = await User.findOne({ _id: req.userId });

    // If employee is not found, return a 404 status
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }


    // Find the corresponding profile picture for the user
    var profilePicture = await ProfilePicture.findOne({ userId: employee._id });
    // If profile picture is found
    if (profilePicture) {
      // Read the file data

      const imageData = fs.readFileSync(`uploads/${profilePicture.path}`);
      // Convert the file data to base64
      const base64Image = Buffer.from(imageData).toString('base64');
      // Add the base64 string to the employee object
      profilePicture = base64Image;
    }


    // If employee is found, return it with a 200 status
    return res.status(200).json({ employee, profilePicture });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

module.exports = router;
