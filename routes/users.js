var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  return res.status(200).json({ message: "users router" });
});

router.get('/employees', async (req, res, next) => {
  var employees = await User.find({ 'role.roleName': 'employee' })
  return res.status(200).json({ employees });
});
module.exports = router;
