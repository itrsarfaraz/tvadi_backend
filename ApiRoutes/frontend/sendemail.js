const express = require("express");
const router = express.Router();
var nodemailer = require('nodemailer');

const cors = require("cors");
const { send } = require("process");
router.use(cors());




router.get("/otp", (req, res) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: 'itrwebtechno@gmail.com',
            pass: 'fvpmkmksmspsjrty'
        }
    });
    var mailOptions = {
        from: 'itrwebtechno@gmail.com',
        to: "jay.ma.bharthi@gmail.com",
        subject: 'Verify Account',
        html: '\
                    <div style="backgroud:#fff;width:100%;padding:10px 0;height:500px;">\
                        <div style="background:#f1f1f1;padding:20px;border-bottom:2px solid grey">Verify Account</div>\
                            <div style="background:#f1f1f1;padding:20px;">\
                            <p>To activate your Twilio Account, please verify your email address. Your account will not be created until your email address is confirmed.</p>\
                            <p>Confirm Your Email</p>\
                            <p> <a href="'+process.env.REACT_APP_URL+'/user/verify?id=' + "54575sa8d8" + '"></p>\
                            <p><button style="padding:10px 15px;background:gray;outline:none;border:none;border-radius:5px;">Verify Email</button></a></p>\
                             <p>Or, copy and paste the following URL into your browser:</p>\
                             <p>'+process.env.REACT_APP_URL+'/user/verify?id=' + "54575sa8d8"+ '</p>\
                      </div>\
                    </div>'
        // html: '<h1>Welcome</h1><p>To activate your Twilio Account, please verify your email address. Your account will not be created until your email address is confirmed.</p>\
        // Confirm Your Email</p>\
        // <p> <a href="http://190.92.153.226/user/verify?id=' + "54575sa8d8" + '"></p>\
        // <p><button style="padding:10px 15px;background:blue;outline:none;border:none;border-radius:5px;">Verify Email</button></a></p>\
        // <p>Or, copy and paste the following URL into your browser:</p>\
        // <p>http://190.92.153.226/user/verify?id=' + "54575sa8d8"+ '</p>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("not Send")
        }
        else {
            console.log(send)
        }
    });
    res.send("sent")
});

// const accountSid = "ACdac441c550e783258e1c0a10c9b4b5e0";
// const authToken = "6db40b0ae148a1974c6ec6fff5acd028";
// const client = require('twilio')(accountSid, authToken,{lazyLoading: true});

// client.messages.create({
//     body: 'verify account link http://190.92.153.226:8000/sendemail/otp',
//     from: '+18449044374',
//     to: '+919571053615'
// }).then(message => console.log(message)).catch((err)=>{
//     console.log(err)
// });
// res.send("working... done")
module.exports = router;
