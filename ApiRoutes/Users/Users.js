const express = require("express");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const fs = require("fs");
// Router
const router = express.Router();
// DataBase
// const mongoose = require("mongoose");
// For Get From Data
const bodyParser = require("body-parser");

const cors = require("cors");
router.use(cors());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//  Connect Database
// mongoose.connect("mongodb://localhost/oatvadmindb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// Use Model
var user = require("../../model/user.js");
var resspace = require("../../model/resspace.js");
var playlist = require("../../model/playlist.js");

const jwt = require("jsonwebtoken");
const { Router } = require("express");

router.post("/add", (req, res) => {
  let saltRounds = 10;
  let salt = bcrypt.genSaltSync(saltRounds);
  try {
    if (req.body && req.body.username && req.body.email && req.body.role) {
      user.find({ email: req.body.email }, (err, data) => {
        if (data.length == 0) {
          user.find({ username: req.body.username }, (err, datausername) => {
            if (datausername.length == 0) {
              if (req.body.opration == "add") {
                let date_ob = new Date();
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();
                let User = new user({
                  email: req.body.email,
                  username: req.body.username,
                  role:req.body.role,
                  password: bcrypt.hashSync(req.body.password, salt),
                  registeredAt: month + "-" + date + "-" + year,
                });
                if (req.body.email.indexOf("@") !== -1) {
                  // send email
                  var transporter = nodemailer.createTransport({
                    service: process.env.MAILSERVICE,
                    secure: false,
                    auth: {
                      user: process.env.MAILUSER,
                      pass: process.env.MAILPASSWORD,
                    },
                  });
                  var mailOptions = {
                    from: process.env.MAILUSER,
                    to: req.body.email,
                    subject: "Verify Account",
                    html:
                      '\
                        <div style="width:100%;padding:10px 0;">\
                            <div style="background:#f1f1f1;padding:20px;border-bottom:2px solid grey;">Verify Account</div>\
                                <div style="background:#f1f1f1;padding:20px;"><img src="'+process.env.REACT_APP_FRONTEND_URL+'/static/media/Button_GoToMainPlayer2.1fd842525de9586ed9c9.png" alt="" srcset="">\
                                <p>To activate your Account, please verify your email address. Your account will not be created until your email address is confirmed.</p>\
                                <p>Confirm Your Email</p>\
                                <p> <a href="'+process.env.REACT_APP_FRONTEND_URL+'/user/verify?ids=' +
                      User._id +
                      '">\
                                <button style="padding:10px 15px;background:gray;outline:none;border:none;border-radius:5px;">Verify Email</button></a></p>\
                                 <p>Or, copy and paste the following URL into your browser:</p>\
                                 <p>'+process.env.REACT_APP_FRONTEND_URL+'/user/verify?ids=' +
                      User._id +
                      "</p>\
                          </div>\
                        </div>",
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      return res.status(400).json({
                        errorMessage: err,
                        status: false,
                      });
                    } else {
                      User.save((err, data) => {
                        if (err) {
                          res.status(400).json({
                            errorMessage: err,
                            status: false,
                          });
                        } else {
                          res.status(200).json({
                            status: true,
                            title: "Registered Successfully.",
                            type: "email",
                          });
                        }
                      });
                    }
                  });
                } else {
                  const accountSid = process.env.ACCOUNTSID;
                  const authToken = process.env.AUTHTOKEN;
                  const client = require("twilio")(accountSid, authToken, {
                    lazyLoading: true,
                  });
                  const inputNumber = "+91" + req.body.email;
                  client.messages
                    .create({
                      body:
                        "verify account link "+process.env.REACT_APP_FRONTEND_URL+"/user/verify?ids=" +
                        User._id,
                      from: process.env.TWILIOFROM,
                      to: inputNumber,
                    })
                    .then((message) => {
                      console.log(message);
                      User.save((err, data) => {
                        if (err) {
                          res.status(400).json({
                            errorMessage: err,
                            status: false,
                          });
                        } else {
                          res.status(200).json({
                            status: true,
                            title: "Registered Successfully.",
                            type: "mobile",
                          });
                        }
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(400).json({
                        errorMessage: "Mobile Number is Invalid",
                        title: "Mobile Number is Invalid.",
                        status: false,
                      });
                    });
                }
              } else {
                user.updateOne(
                  { _id: req.body.id },
                  {
                    email: req.body.email,
                    username: req.body.username,
                    role: req.body.role,
                  },
                  function (err, data) {
                    if (err) throw err;
                    if (err) {
                      return res.status(400).json({
                        errorMessage: err,
                        status: false,
                      });
                    } else {
                      return res.status(200).json({
                        status: true,
                        title: "User Update Successfully.",
                        dataValue: data,
                      });
                    }
                  }
                );
              }
            } else {
              res.status(400).json({
                errorMessage: `UserName ${req.body.username} Already Exist!`,
                status: false,
              });
            }
          });
        } else {
          res.status(400).json({
            errorMessage: `Email ${req.body.email} Already Exist!`,
            status: false,
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: `Please fill all fields!`,
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

//  send forget password link

router.post("/forget_password", (req, res) => {
  user.find({ email: req.body.email }, (err, data) => {
    if (data.length == 0 || data[0].status == 0) {
      return res.status(400).json({
        errorMessage: err,
        status: false,
      });
    } else {
      if (data.length > 0) {
        console.log("error");

        if (req.body.email.indexOf("@") !== -1) {
          // send email
          var transporter = nodemailer.createTransport({
            service: process.env.MAILSERVICE,
            secure: false,
            auth: {
              user: process.env.MAILUSER,
              pass: process.env.MAILPASSWORD,
            },
          });
          var mailOptions = {
            from: process.env.MAILUSER,
            to: req.body.email,
            subject: "Reset Password",
            html:
              '\
            <div style="backgroud:#fff;width:100%;padding:10px 0;height:500px;">\
                <div style="background:#f1f1f1;padding:20px;border-bottom:2px solid gray">Reset Password</div>\
                    <div style="background:#f1f1f1;padding:20px;">\
                    <p>Hi ' +
              data[0].username +
              ",<p/><p>We've recived a request to set new password for this OpenAirTv Account: " +
              data[0].email +
              '.</p>\
                    <p><a href="'+process.env.REACT_APP_FRONTEND_URL+'/user/changepwd?ids=' +
              data[0]._id +
              '">\
                    <button style="padding:10px 15px;background:gray;outline:none;border:none;border-radius:5px;">Set New Password</button></a></p>\
                     <p>Or, copy and paste the following URL into your browser:</p>\
                     <p>'+process.env.REACT_APP_FRONTEND_URL+'/user/changepwd?ids=' +
              data[0]._id +
              "</p>\
              </div>\
            </div>",
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(400).json({
                errorMessage: err,
                status: false,
              });
            } else {
              res.status(200).json({
                status: true,
                title: "Send ",
                type: "email",
              });
            }
          });
        } else {
          const accountSid = process.env.ACCOUNTSID;
          const authToken = process.env.AUTHTOKEN;
          const client = require("twilio")(accountSid, authToken, {
            lazyLoading: true,
          });
          const inputNumber = "+91" + req.body.email;
          client.messages
            .create({
              body:
                "Reset password link "+process.env.REACT_APP_FRONTEND_URL+"/user/changepwd?ids=" +
                data[0]._id,
              from: process.env.TWILIOFROM,
              to: inputNumber,
            })
            .then((message) => {
              res.status(200).json({
                status: true,
                title: "Registered Successfully.",
                type: "mobile",
              });
            })
            .catch((err) => {
              return res.status(400).json({
                errorMessage: err,
                status: false,
              });
            });
        }
      }
    }
  });
});
// Update Password
router.post("/update_password", (req, res) => {
  let salt = bcrypt.genSaltSync(10);
  user.updateOne(
    { _id: req.body.id },
    { password: bcrypt.hashSync(req.body.password, salt) },
    (err, docs) => {
      if (err) {
        return res.status(400).json({
          errorMessage: err,
          status: false,
        });
      } else {
        res.status(200).json({
          status: true,
          title: "Update Successfully.",
        });
      }
    }
  );
});

// End Update Password

// Change Password

router.post("/change_password", (req, res) => {
  let saltRounds = 10;
  let salt = bcrypt.genSaltSync(saltRounds);
  try {
    if (req.body && req.body.password == req.body.confirmPassword) {
      user.find({ password: req.body.password }, (err, data) => {
        if (data.length == 0) {
          if (req.body.opration !== "changePassword") {
            let User = new user({
              password: bcrypt.hashSync(req.body.password, salt),
            });
            User.save((err, data) => {
              if (err) {
                res.status(400).json({
                  errorMessage: err,
                  status: false,
                });
              } else {
                res.status(200).json({
                  status: true,
                  title: "Registered Successfully.",
                });
              }
            });
          } else {
            if (bcrypt.compareSync(req.body.old_password, data[0].password)) {
              res.send("done");
              user.updateOne(
                { _id: req.body.id },
                { password: bcrypt.hashSync(req.body.password, salt) },
                function (err, res) {
                  if (err) throw err;
                  if (err) {
                    return res.status(400).json({
                      errorMessage: err,
                      status: false,
                    });
                  } else {
                    return res.status(200).json({
                      status: true,
                      title: "User Update Successfully.",
                      dataValue: data,
                    });
                  }
                }
              );
            } else {
              res.status(400).json({
                errorMessage: `Old Password doesn't Match`,
                status: false,
              });
            }
          }
        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false,
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: `Password Doesn't match!`,
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

// End Change Password

router.get("/getAlldata", (req, res) => {
  // console.log("searchtearm - ", req.query.searchtearm);
  if (req.headers.token) {
    jwt.verify(req.headers.token, "shhhhh11111", function (err) {
      user.find(
        {
          $or: [
            {
              email: { $regex: req.query.searchtearm, $options: "i" },
              username: { $regex: req.query.searchtearm, $options: "i" },
            },
          ],
        },
        function (err, data) {
          if (err) throw err;
          res.send(data);
        }
      );
    });
  } else {
    return res.json({ status: 400, errors: "Unauthorised User" });
  }
});

router.get("/getResspaceData", (req, res) => {
  if (req.headers.token) {
    jwt.verify(req.headers.token, "shhhhh11111", function (err) {
      resspace.find({}, function (err, data) {
        if (err) throw error;
        res.send(data);
      });
    });
  } else {
    return res.json({ status: 400, errors: "Unauthorised User" });
  }
});

router.post("/delete", (req, res) => {
  try {
    if (req.body.id) {
      user.deleteOne({ _id: req.body.id }, function (err) {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false,
          });
        }
      });
      res.status(200).json({
        status: true,
        title: "Delete Successfully.",
      });
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

router.post("/deleteMultipleUsers", (req, res) => {
  for (let index = 0; index < req.body.ids.length; index++) {
    if (req.body.ids[index].allPlaylists != 0) {
      playlist.deleteMany(
        { users: req.body.ids[index]._id },
        function (err) {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false,
            });
          }
        }
      );
    }
  }
  user.deleteMany({ _id: req.body.ids }, function (err) {
    if (err) {
      res.status(400).json({
        errorMessage: err,
        status: false,
      });
    }
  });

  res.status(200).json({
    status: true,
    title: "Delete Successfully.",
  });
});

/* login api */
router.post("/login", (req, res) => {
  try {
    if (req.body && req.body.email && req.body.password) {
      user.find({ email: req.body.email }, (err, data) => {
        if(!data){
          return res.status(400).json({
            errorMessage: "Email Address is Invalid !",
            status: false,
          });
        }
        console.log(data)
        if (data.length > 0 && data[0].status == 1) {
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {
            res.status(400).json({
              errorMessage: "password is incorrect",
              status: false,
            });
          }
        } else {
          if (req.body.email.indexOf("@") !== -1) {
            res.status(400).json({
              errorMessage: "Email Address is Invalid !",
              status: false,
            });
          } else {
            res.status(400).json({
              errorMessage: "Mobile Number is Invalid !",
              status: false,
            });
          }
        }
      });
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

function checkUserAndGenerateToken(data, req, res, next) {
  jwt.sign(
    { email: data.email, id: data._id },
    "shhhhh11111",
    { expiresIn: "1d" },
    (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: "Login Successfully.",
          token: token,
          errorMessage: "Success",
          status: true,
          role: data.role,
          username: data.username,
          user_id: data._id,
          email: data.email,
        });
      }
    }
  );
}

router.post("/verify", (req, res) => {
  user.find({ _id: req.body.id }, (err, data) => {
    user.updateOne(
      { _id: req.body.id },
      { status: 1 },
      function (err, docsUpdate) {
        if (err) {
          res.status(400).json({
            status: false,
            errorMessage: err,
          });
        } else {
          res.send("update");
        }
      }
    );
  });
});

const storage = multer.diskStorage({
  destination: path.join(
    __dirname,
    "../../../frontend/public/asset/",
    "profile"
  ),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

router.post("/profileupload", (req, res) => {
  let upload = multer({ storage: storage }).single("avtar");
  upload(req, res, function (err) {
    if (!req.file) {
      return res.send("Please select image");
    } else {
      var filePath =
        path.join(__dirname, "../../../frontend/public/asset/", "profile") +
        "/" +
        req.file.originalname;
      var NewfilePath =
        path.join(__dirname, "../../../frontend/public/asset/", "profile") +
        "/" +
        req.originalUrl.split("?")[1] +
        "_" +
        req.file.originalname;
      if (fs.existsSync(filePath)) {
        fs.rename(filePath, NewfilePath, (error) => {
          if (error) {
            console.log(error);
          } else {
            user.updateOne(
              { _id: req.originalUrl.split("?")[1] },
              {
                profile:
                  req.originalUrl.split("?")[1] + "_" + req.file.originalname,
              },
              { userbio: req.body.data },
              function (err, docsUpdate) {
                if (err) {
                  res.status(400).json({
                    status: false,
                    errorMessage: err,
                  });
                } else {
                  res.send("update");
                }
              }
            );
          }
        });
      } else {
        console.log("not found");
      }
    }
  });
});
router.post("/bioupdate", (req, res) => {
  user.updateOne(
    { _id: req.body.user },
    {
      userbio: req.body.data,
      Name: req.body.Name,
      Phone: req.body.Phone,
      Mobile: req.body.Mobile,
      Address: req.body.Address,
      userAbout: req.body.userAbout,
    },
    function (err, docsUpdate) {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.send("update");
      }
    }
  );
});

router.post("/contact", (req, res) => {
  // send email
  var transporter = nodemailer.createTransport({
    service: process.env.MAILSERVICE,
    secure: false,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASSWORD,
    },
  });
  var mailOptions = {
    from: process.env.MAILUSER,
    to: "itrsarfaraz@gmail.com",
    subject: "Contact Us",
    html:
      '\
        <div style="backgroud:#fff;width:100%;padding:10px 0;height:500px;">\
            <div style="background:#f1f1f1;padding:20px;border-bottom:2px solid gray">Contact Details</div>\
                <div style="background:#f1f1f1;padding:20px;">\
                <p>Contact user -: </p>\
                <p>name -: ' +
      req.body.name +
      "\
                <p>Email -: " +
      req.body.email +
      "\
                <p>Message -: " +
      req.body.message +
      "\
          </div>\
        </div>",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(400).json({
        errorMessage: error,
        status: false,
      });
    } else {
      // send user Response
      var transporter = nodemailer.createTransport({
        service: process.env.MAILSERVICE,
        secure: false,
        auth: {
          user: process.env.MAILUSER,
          pass: process.env.MAILPASSWORD,
        },
      });
      var mailOptions = {
        from: process.env.MAILUSER,
        to: req.body.email,
        subject: "Contact Us",
        html: '\
          <div style="backgroud:#fff;width:100%;padding:10px 0;height:500px;">\
              <div style="background:#f1f1f1;padding:20px;border-bottom:2px solid gray">Thanks for Contact</div>\
                  <div style="background:#f1f1f1;padding:20px;">\
                  <p>Your request has been recived and is being reviewed by our Support Staff </p>\
                  <p>to add additional comments, replay to this email. </p>\
            </div>\
          </div>',
      };
      transporter.sendMail(mailOptions, function (newError, info) {
        if (newError) {
          return res.status(400).json({
            errorMessage: newError,
            status: false,
          });
        } else {
          res.send("he");
        }
      });
    }
  });
});

const Resstorage = multer.diskStorage({
  destination: path.join(
    __dirname,
    "../../../admin/public/assets/images/",
    "reserved"
  ),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

router.post("/updateResImage", (req, res) => {
  let upload = multer({ storage: Resstorage }).single("avtar");
  // let upload1 = multer({ storage: Resstorage1 }).single("avtar1");
  upload(req, res, function (err) {
    console.log(req.file);
    if (!req.file) {
      return res.send("Please select image");
    } else {
      var filePath =
        path.join(
          __dirname,
          "../../../admin/public/assets/images/",
          "reserved"
        ) +
        "/" +
        req.file.originalname;
      var NewfilePath =
        path.join(
          __dirname,
          "../../../admin/public/assets/images/",
          "reserved"
        ) +
        "/" +
        req.body.pagename +
        "_" +
        req.file.originalname;
      if (fs.existsSync(filePath)) {
        fs.rename(filePath, NewfilePath, (error) => {
          if (error) {
            console.log(error);
          } else {
            resspace.find(
              { imagelocation: req.body.imagelocation },
              (err, dataresspace) => {
                if (dataresspace.length == 0) {
                  let Resspace = new resspace({
                    pagename: req.body.pagename,
                    resimage: req.body.pagename + "_" + req.file.originalname,
                    imagelocation: req.body.imagelocation,
                  });
                  Resspace.save((err, data) => {
                    if (err) {
                      res.status(400).json({
                        errorMessage: err,
                        status: false,
                      });
                    } else {
                      res.status(200).json({
                        status: true,
                        title: "Registered Successfully.",
                        type: "email",
                      });
                    }
                  });
                } else {
                  resspace.updateOne(
                    { imagelocation: req.body.imagelocation },
                    {
                      resimage: req.body.pagename + "_" + req.file.originalname,
                    },
                    { pagename: req.body.pagename },
                    function (err, docsUpdate) {
                      if (err) {
                        res.status(400).json({
                          status: false,
                          errorMessage: err,
                        });
                      } else {
                        res.send("update");
                      }
                    }
                  );
                }
              }
            );
          }
        });
      } else {
        console.log("not found");
      }
    }
  });
});

router.get("/getUserAlldata", (req, res) => {
  if (req.headers.token) {
    jwt.verify(req.headers.token, "shhhhh11111", function (err) {
      user.find({}, function (err, data) {
        if (err) throw error;
        res.send(data);
      });
    });
  } else {
    return res.json({ status: 400, errors: "Unauthorised User" });
  }
});

module.exports = router;
