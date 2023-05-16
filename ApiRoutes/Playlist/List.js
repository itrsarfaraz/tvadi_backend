const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
var exec = require("child_process").exec;

const cors = require("cors");
router.use(cors());
router.use(express.json({ limit: "50mb" }));
router.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// mongoose.connect("mongodb://localhost/oatvadmindb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
var lists = require("../../model/playlist.js");
var playList_video = require("../../model/playlist_videos.js");
var videos = require("../../model/videos.js");
var users = require("../../model/user.js");
// var introVideo = require("../../model/introvideo.js");

const { send } = require("process");

//  Add Play List

router.post("/add", (req, res) => {
  if (req.body.opration == "add") {
    let list = new lists({
      title: req.body.title,
      users: req.body.user,
    });
    //  Save Data
    list.save((err, data) => {
      if (err) {
        return res.status(400).json({
          errorMessage: err,
          status: false,
        });
      } else {
        return res.status(200).json({
          status: true,
          title: "Play List Add Successfully.",
          dataValue: data,
        });
      }
    });
  } else if (req.body.opration == "deleteIntro") {
    fs.unlink('/home/oatvadmin/public_html/frontend/public/asset/introvideo/' + req.body.fileLocation, function (err) {
      if (err) throw err;
      console.log('File deleted!');
    });
    lists.updateOne(
      { _id: req.body.currentplaylistid },
      { introVideo: null },
      function (err, introres) {
        res.send("introSend");
      }
    );
  } else {
    lists.updateOne(
      { _id: req.body.id },
      { title: req.body.title },
      function (err, res2) {
        if (err) throw err;
        if (err) {
          return res.status(400).json({
            errorMessage: err,
            status: false,
          });
        } else {
          return res.status(200).json({
            status: true,
            title: "PlayList Update Successfully.",
            dataValue: "data",
          });
        }
      }
    );
  }
});

//  Upload File
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(
    __dirname,
    "../../../frontend/public/asset/",
    "introvideo"
  ),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

router.post("/upload", (req, res) => {
  let upload = multer({ storage: storage }).single("avtarvid");
  upload(req, res, function (err) {
    console.log("Request File", req.file);
    if (!req.file) {
      res.status(400).json({
        status: false,
        errorMessage: "Please Select File",
      });
    } else {
      if (req.file.size <= 100000000) {
        var filePath =
          path.join(__dirname, "../../../frontend/public/asset/", "introvideo") +
          "/" +
          req.file.originalname;
        var NewfilePath =
          path.join(__dirname, "../../../frontend/public/asset/", "introvideo") +
          "/" +
          req.originalUrl.split("?")[1] +
          "_" +
          req.file.originalname;
        if (fs.existsSync(filePath)) {
          fs.rename(filePath, NewfilePath, (error) => {
            if (error) {
              res.status(400).json({
                status: false,
                errorMessage: error,
              });
            } else {
              lists.updateOne(
                { _id: req.originalUrl.split("?")[1] },
                {
                  introVideo:
                    req.originalUrl.split("?")[1] + "_" + req.file.originalname,
                },
                function (err, docsUpdate) {
                  if (err) {
                    res.status(400).json({
                      status: false,
                      errorMessage: err,
                    });
                  }
                }
              );

              return res.status(200).json({
                status: true,
                title: "Video Added Successfully.",
              });
              // console.log("Done");
            }
          });
        } else {
          console.log("not found");
        }
      } else {
        res.status(400).json({
          errorMessage: `File Size Must Be Less Than 100 MB`,
          status: false,
        });
      }
    }
  });
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
  upload(req, res, function (err) {
    csvtojson()
      .fromFile(req.file.path)
      .then((csvData) => {
        lists.insertMany(csvData, (err, res) => {
          if (err) throw err;
          console.log(`Inserted: ${res.insertedCount} rows`);
        });
      });
  });
});

// End Upload Csv

// All Get Data of playList
router.post("/getAlldata", (req, res) => {
  console.log(req.body.searchtearm);
  lists
    .find({ title: { $regex: req.body.searchtearm, $options: "i" } })
    .populate("videos")
    .populate("users")
    .then((data) => {
      var userData = [];
      for (let index = 0; index < data.length; index++) {
        data[index].users.forEach(element => {
          userData.push(element.username)
        });
      }
      res.send(data);
    })
    .catch((error) => console.log(error));
});

// All Get Data of playList
router.post("/getPlayListByUserId", (req, res) => {
  lists
    .countDocuments({ users: req.body.userid })
    .then((data) => {
      res.status(200).json({
        count: data,
      });
    })
    .catch((error) => console.log(error));
});


//  Add video in playList
router.post("/addVideoinplaylist", (req, res) => {
  playlist_id = req.body.playlist;
  let video_title = req.body.title;
  let video_url = req.body.url;
  let video_creator = "Sarfaraz";
  let video_logo = req.body.thumbnail;
  let addVideoinplaylistObj = new playList_video();
  addVideoinplaylistObj.playlist = playlist_id;
  addVideoinplaylistObj.title = video_title;
  addVideoinplaylistObj.creator = video_creator;
  addVideoinplaylistObj.logo = video_logo;
  addVideoinplaylistObj.url = video_url;
  addVideoinplaylistObj.save((err, data) => {
    if (err) {
      res.status(400).json({
        errorMessage: err,
        status: false,
        title: "Error Video Not Added in PlayList",
      });
    } else {
      lists.findById(playlist_id, function (err, playListData) {
        var oldData = playListData.videos;
        oldData.push(data._id);
        res.send(oldData);
        lists.findOneAndUpdate(
          { _id: playListData._id },
          { videos: oldData },
          function (err, res) {
            if (err) {
              res.send(err);
            } else {
              res.status(200).json({
                status: true,
                title: "Video Added Successfully.",
              });
            }
          }
        );
      });
    }
  });
});

router.post("/delete", (req, res) => {
  lists.deleteOne({ _id: req.body.ids }, function (err) {
    if (err) {
      res.status(400).json({
        errorMessage: err,
        status: false,
      });
    } else {
      res.status(200).json({
        status: true,
        title: "Delete Successfully.",
      });
    }
  });
});

router.post("/deleteMultiplePlaylist", (req, res) => {
  lists.find({ _id: req.body.ids }).then((data) => {
    for (let playListindex = 0; playListindex < data.length; playListindex++) {
      let playListVideos = data[playListindex].videos;
      playListVideos.forEach((element, index) => {
        lists.countDocuments({ videos: element }).then((count) => {
          if (count == 1) {
            videos.deleteOne({ _id: element }).then((success) => {
              console.log("done");
            });
          }
        });
      });
      lists.deleteMany({ _id: req.body.ids }, function (err) {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false,
          });
        }
      });
    }
    res.status(200).json({
      status: true,
      title: "Delete Successfully.",
    });
  });
});

router.post("/setSelectedRandomPool", (req, res) => {
  lists.updateMany({ _id: req.body.ids }, { locationStatus: req.body.locationStatus }, function (err) {
    if (err) {
      res.status(400).json({
        errorMessage: err,
        status: false,
      });
    }
  });

  res.status(200).json({
    status: true,
    title: "Set on Home.",
  });
});

router.post("/setSelectedMorePool", (req, res) => {
  for (let index = 0; index < req.body.ids.length; index++) {
    videos.updateMany(
      { _id: req.body.ids[index].videos },
      { MorelocationStatus: req.body.locationStatus },
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
  res.status(200).json({
    status: true,
    title: "Set on MorePool.",
  });
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
