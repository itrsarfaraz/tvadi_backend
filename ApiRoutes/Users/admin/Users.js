const express = require('express');
const bcrypt = require('bcrypt');
// Router
const router = express.Router();
// DataBase
const mongoose = require('mongoose');
// For Get From Data
const bodyParser = require('body-parser');
const cors = require('cors');
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json());


// //  Connect Database
// const mongooseConnectDB = require("../../../mangoose.db.connect.js");
// mongooseConnectDB();
// mongoose.connect('mongodb+srv://sarfaraz:Sfkhan7615@cluster0.mh72y0u.mongodb.net/oatvadmindb',{useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb://localhost/oatvadmindb',{useNewUrlParser: true, useUnifiedTopology: true});
// Use Model 
var user = require("../../../model/user.js");



router.post("/add", (req, res) =>
{
    if (req.body.opration == "add") {
      let Users = new user({
        username: req.body.username,
        usertype: req.body.usertype,
        email: req.body.email,
        password: req.body.password
      });
      //  Save Data
      Users.save((err, data) => {
        if (err) {
          return res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
            return res.status(200).json({
              status: true,
              title: 'User Add Successfully.',
              dataValue: data
            });
        }
      });
    }
    else
    {
        res.send("done");
        Users.updateOne({_id:req.body.id},{username:req.body.username},{password:req.body.password},{email:req.body.email},{usertype:req.body.usertype},function(err,res){
           if (err) throw err;
           if (err) 
           {
            return res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
              return res.status(200).json({
                status: true,
                title: 'User Update Successfully.',
                dataValue: data
              });
          }
        })
    }
});




router.get("/getAlldata",(req,res)=>
{
  user.find({},function(err,data){
        if(err) throw error;
        res.send(data);
    });
});



router.post("/delete", (req, res ) => {
  try {
    if (req.body.id) {
      user.deleteOne({ _id:req.body.id}, function(err)
      {
          if (err) 
          { 
              res.status(400).json({
                errorMessage: err,
                status: false
              });
          } else {
            res.status(200).json({
              status: true,
              title: 'Delete Successfully.'
            });
          }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});








router.get("/delete",(req,res)=>
{  
    res.send("Delete");
});



router.get("/add",(req,res)=>
{  
	res.send("HELLO");
});


module.exports = router;







