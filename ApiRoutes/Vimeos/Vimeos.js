const express = require('express');
const bcrypt = require('bcrypt');
// Router
const router = express.Router();
// DataBase
// const mongoose = require('mongoose');
// For Get From Data
const bodyParser = require('body-parser');

const cors = require('cors');
router.use(cors());

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json());


//  Connect Database
// mongoose.connect('mongodb://localhost/oatvadmindb', {useNewUrlParser: true, useUnifiedTopology: true});
// Use Model 
// End Update Password

router.get("/getAlldata",(req,res)=>
{  
    res.send(req);
});

module.exports = router;
