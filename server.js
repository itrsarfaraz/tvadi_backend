var express = require("express");
var app = express();
path = require('path');
const mongoose = require('mongoose');


app.get("/test", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});
//  Connect Database
const mongooseConnectDB = require("./mangoose.db.connect.js");
mongooseConnectDB();
app.use("/", (req, res, next) => {
  try {
    if (req.path == "/user/login" || req.path == "/user/contact" || req.path == "/register" || req.path == "/" || req.path == "/user/getAlldata" || req.path == "/user/delete" || req.path == "/user/update_password" || req.path == "/user/getUserAlldata") {
      next();
    }
    else if (req.path == "/playlist_video/delete" || req.path == "/playlist_video/add" || req.path == "/playlist_video/getAlldata" || req.path == "/manageplaylist/add" || req.path == "/manageplaylist/findYoutubeValidater" || req.path == "/manageplaylist/importCsv" || req.path == "/playlist/importCsv" || req.path == "/manageplaylist/upload" || req.path == "/manageplaylist/getAlldata" || req.path == "/manageplaylist/addVideoinplaylist" || req.path == "/manageplaylist/getAllUserdata" || req.path == "/manageplaylist/getPlayListByUserId" || req.path == "/manageplaylist/delete" || req.path == "/manageplaylist/deleteMultiplePlaylist" || req.path == "/manageplaylist/setSelectedHomePlay" || req.path == "/manageplaylist/setSelectedMorePool" || req.path == "/manageplaylist/setSelectedRandomPool") {
      next();
    }
    else if (req.path == "/user/add" || req.path == "/homecontrol/add" || req.path == "/homecontrol/clear" || req.path == "/homecontrol/getAlldata" || req.path == "/user/updateResImage" || req.path == "/user/profileupload" || req.path == "/user/bioupdate" || req.path == "/admin/user/add" || req.path == "/admin/user/getAlldata" || req.path == "/admin/user/delete" || req.path == "/admin/user/update" || req.path == "/user/deleteMultipleUsers") {
      next();
    }
    else if (req.path == "/vimeo/add" || req.path == "/admin/vimeo/add" || req.path == "/admin/vimeo/getAlldata" || req.path == "/admin/vimeo/delete" || req.path == "/admin/vimeo/getAlldata") {
      next();
    }
    else if (req.path == "/playlist/getPlayListData" || req.path == "/manageplaylist/findYoutubeValidater" || req.path == "/playlist/getLiveVideoData" || req.path == "/playlist/getVideoData" || req.path == '/addvideoplaylist/add' || req.path == '/playlist/savePlayListData') {
      next();
    }
    else if (req.path == "/sendemail/otp" || req.path == "/user/verify" || req.path == "/user/forget_password" || req.path == "/playlist/setmetaimage" || req.path == "/playlist/like" || req.path == "/user/getResspaceData") {
      next();
    }
    else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});








///////////////////////////////////////////////    All Routes Call   ////////////////////////////////////////////////

// Call Route Files
const videoRoute = require("./ApiRoutes/Playlist/Video.js");
const userRoute = require("./ApiRoutes/Users/Users.js");
const homeControlRoute = require("./ApiRoutes/HomeControl/Homecontrol.js");
const listRoute = require("./ApiRoutes/Playlist/List.js");
// frontend
const palylist = require("./ApiRoutes/frontend/playlist_videos.js");
// send mail
const sendEmail = require("./ApiRoutes/frontend/sendemail.js");
// admin files
const userAdminRoute = require("./ApiRoutes/Users/admin/Users.js");
const vimeoAdminRoute = require("./ApiRoutes/Vimeos/Vimeos.js");
// add video in playlist
const AddVideoInPlayList = require("./ApiRoutes/Playlist/addVideoInPlaylist.js");
//  Define All Route (Ps)
app.use('/playlist_video', videoRoute);
app.use('/user', userRoute);
app.use('/homecontrol', homeControlRoute);
app.use('/admin/user/', userAdminRoute);
app.use('/vimeo/', vimeoAdminRoute);
app.use('/manageplaylist', listRoute);
app.use('/addvideoplaylist', AddVideoInPlayList)
app.use('/sendemail', sendEmail);
app.use('/playlist', palylist);

app.listen(8000, () => {
  console.log("Server is Runing On port 8000");
});


