const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const fs = require("fs");
const client = require("https");
const multer = require("multer");
var exec = require("child_process").exec;

router.use(cors());

router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

// mongoose.connect("mongodb://localhost/oatvadmindb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const mongooseConnectDB = require("../../mangoose.db.connect.js");
// mongooseConnectDB();
var videos = require("../../model/videos.js");
var playlist = require("../../model/playlist.js");

const { error, time } = require("console");
const { title } = require("process");
const e = require("express");

router.get("/", (req, res) => {
  res.send("Testing");
});

router.get("/getPlayListData", (req, res) => {
  playlist
    .find()
    .sort({ _id: -1 })
    .populate("users")
    .populate("videos")
    .then((data) => {
      res.send(data);
    })
    .catch((error) => console.log(error));
});
// .populate({ path: "videos", options: { sort: { _id: -1 } } })  // for sorting

router.get("/getLiveVideoData", (req, res) => {
  // if (req.headers.token) {
  videos
    .find({ duration: "0" })
    .limit(3)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => console.log(error));
  // }else{
  //   return res.json({ status: 400, errors: "Unauthorised User" });
  // }
});

router.get("/getVideoData", (req, res) => {
  // if (req.headers.token) {
  videos
    .find()
    .sort('-updatedAt')
    .then((data) => {
      res.send(data);
    })
    .catch((error) => console.log(error));
  // }else{
  //   return res.json({ status: 400, errors: "Unauthorised User" });
  // }
});

//  Add Video in playlist
router.post("/savePlayListData", (req, res) => {
  var allData = req.body.all_playlist_data;
  if (req.body.user != "new") {
    var error = 0;
    const allVideosId = [];
    allData.forEach((element) => {
      if (element._id) {
        allVideosId.push(element._id);
      } else {
        var addVideoObj = new videos(element);
        allVideosId.push(addVideoObj._id);
        addVideoObj.save((err, data) => {
          if (err) {
            error++;
          }
        });
      }
    });
    playlist.updateOne(
      { _id: req.body.playlist_id },
      { videos: allVideosId },
      function (err, docsUpdate) {
        if (err) {
          res.status(400).json({
            status: false,
            title: "Error : Playlist not updated !",
          });
        } else {
          res.status(200).json({
            status: true,
            title: "Playlist Updated Successfully",
          });
        }
      }
    );
  } else {
    let list = new playlist({
      title: req.body.title,
      users: req.body.user_id,
    });
    list.save((err, newPlaylistdata) => {
      if (err) {
        console.log(err);
      } else {
        var error = 0;
        const allVideosId = [];
        allData.forEach((element) => {
          if (element._id) {
            allVideosId.push(element._id);
          } else {
            var addVideoObj = new videos(element);
            allVideosId.push(addVideoObj._id);
            addVideoObj.save((err, data) => {
              if (err) {
                error++;
              }
            });
          }
        });
        playlist.updateOne(
          { _id: newPlaylistdata._id },
          { videos: allVideosId },
          function (err, docsUpdate) {
            if (err) {
              res.status(400).json({
                status: false,
                title: "Error : Playlist not updated !",
              });
            } else {
              res.status(200).json({
                status: true,
                title: "Playlist Updated Successfully",
              });
            }
          }
        );
      }
    });
  }
});

// Upload Csv
const storageCsv = multer.diskStorage({
  destination: path.join(
    __dirname,
    "../../../frontend/src/asset/",
    "introvideo"
  ),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});



const csvtojson = require("csvtojson");
router.post("/importCsv", (req, res) => {
  let upload = multer({ storage: storageCsv }).single("avtar");
  upload(req, res, async function (err) {
    csvtojson()
      .fromFile(req.file.path)
      .then(async (csvData) => {
        var allVideosId = [];
        csvData.forEach((element, index) => {
          dataWithId = csvData[index];
          dataWithPlaylistId = csvData[index];
          dataWithId["user_id"] = req.body.userId;
          dataWithPlaylistId["playlistId"] = req.body.PlaylistId;
        });
        for (let index = 0; index < csvData.length; index++) {
          var VideoUrl = csvData[index].url.replace(
            "https://youtube.com/watch?v=",
            process.env.YOUTUBE_URL
          );
          var command = "curl -s " + VideoUrl + ' | grep "UNPLAYABLE" | wc -l';
          child = exec(command, function (error, stdout, stderr) {
            if (error !== null) {
              console.log("exec error: " + error);
            }
            let inputData = csvData[index];
            // 1 or true means, its UNPLAYABLE otherwise its playble
            if (stdout != 1) {
              videos.create(inputData, (err, res1) => {
                if (err) throw err;
                val = (res1._id);
                allVideosId.push(val);
              });
            }
          });
        }
        var a = '';
        a = setInterval(function () {
          if (req.body.playlist_id && allVideosId.length > 0) {
            clearInterval(a);
            playlist.updateOne(
              { _id: req.body.playlist_id },
              { videos: allVideosId },
              function (err, docsUpdate) {
                if (err) {
                  res.status(400).json({
                    status: false,
                    title: "Error : Playlist not updated !",
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    title: "Playlist Updated Successfully",
                  });
                }
              }
            );
          }
        }, 1000);

      });
  });
});


router.post("/setmetaimage", (req, res) => {
  client.get(req.body.img, (res) => {
    res.pipe(
      fs.createWriteStream("../frontend/public/thumbnail_images/hello.png")
    );
  });
  res.send(req.body.img);
});

router.post("/like", (req, res) => {
  console.log(req.body)
  // if user liked video
  if (req.body.opr == "like") {
    videos
      .find({ _id: req.body.video })
      .distinct("likes_by")
      .then((data) => {
        if (data[0] != null) {
          if (data[0].search(req.body.user) == -1) {
            var newData = data[0] + "," + req.body.user;
            videos
              .updateOne({ _id: req.body.video }, { likes_by: newData })
              .then((err, docs) => {
                if (err) {
                  res.status(400).json({
                    status: false,
                    title: "Error : Likes not updated 1",
                  });
                }
              });
          } else {
            res.status(400).json({
              status: false,
              title: "Already Exist",
            });
          }
        } else {
          videos
            .updateOne({ _id: req.body.video }, { likes_by: req.body.user })
            .then((err, docs) => {
              if (err) {
                res.status(400).json({
                  status: false,
                  title: "Error : Likes not updated 2",
                });
              } else {
                res.status(200).json({
                  status: true,
                  title: "Likes Successfully",
                });
              }
            });
        }
      });
  } else {
    var newData = [];
    videos
      .find({ _id: req.body.video })
      .distinct("likes_by")
      .then((data) => {
        var likeByUser = data[0].split(",");
        for (let i = 0; i < likeByUser.length; i++) {
          if (likeByUser[i] != req.body.user) newData.push(likeByUser[i]);
        }
        var newLikesUser = newData.toString();
        videos
          .updateOne({ _id: req.body.video }, { likes_by: newLikesUser })
          .then((err, docs) => {
            if (err) {
              res.status(400).json({
                status: false,
                title: "Error : DisLikes not updated",
              });
            } else {
              res.status(200).json({
                status: true,
                title: "DisLikes Successfully",
              });
            }
          });
      });
  }
});

/* method just to identify weather embed URL is correct or not. */
router.post("/findYoutubeValidater", (req, res) => {
  var command = "curl -s " + req.body.videoURL + ' | grep "UNPLAYABLE" | wc -l';
  child = exec(command, function (error, stdout, stderr) {
    if (error !== null) {
      console.log("exec error: " + error);
    }
    // 1 or true means, its UNPLAYABLE otherwise its playble
    let status = "PLAYABLE";
    if (stdout == 1) {
      status = "UNPLAYABLE";
    }
    return res.status(200).json({ status: status });
  });
});

module.exports = router;
