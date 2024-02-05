var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    const {client, employee, service, date} = req.body;
    
    res.status(200).json("ehehehehe appointment");
});



module.exports = router;