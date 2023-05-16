const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");

const cors = require("cors");
router.use(cors());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);
mongoose.connect("mongodb://localhost/oatvadmindb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var lists = require("../../model/playlist.js");
var playList_video = require("../../model/playlist_videos.js");
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
  } else {
    res.send("done");
    lists.updateOne(
      { _id: req.body.id },
      { title: req.body.title },
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
            title: "Play List Update Successfully.",
            dataValue: data,
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

// const videoUpload = multer({
//   storage: videoStorage,
//   limits: {
//     fileSize: 10000000, // 10000000 Bytes = 10 MB
//   },
//   fileFilter(req, file, cb) {
//     // upload only mp4 and mkv format
//     // if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
//     //   return cb(new Error("Please upload a video"));
//     // }
//     cb(undefined, true);
//   },
// });

// router.post(
//   "/upload",
//   // videoUpload.single("video"),

//   (req, res) => {
//     console.log(req.body);
//     // res.send(req.body.video)

//     let addIntroVideo = new introVideo();
//     addIntroVideo.title = req.body.title;
//     addIntroVideo.video = req.body.video;

//     /*Now do where ever you want to do*/
//     addIntroVideo.save((err, data) => {
//       if (!err) return res.send(200).end();
//     });
//   },
//   (error, req, res) => {
//     res.status(400).send({ error: error.message });
//   }
// );

router.post("/upload", (req, res) => {
  let upload = multer({ storage: storage }).single("avtarvid");
  upload(req, res, function (err) 
  {
    console.log(req.file);
    if (!req.file) {
      // return res.send("Please select Video");
      res.status(400).json({
        status: false,
        errorMessage: "Please Select File",
      });
    } else {
      if(req.file.size <= 5000000){
        var filePath =
          path.join(__dirname, "../../../frontend/src/asset/", "introvideo") +
          "/" +
          req.file.originalname;
        var NewfilePath =
          path.join(__dirname, "../../../frontend/src/asset/", "introvideo") +
          "/" +
          req.originalUrl.split("?")[1] +
          "_" +
          req.file.originalname;
        if (fs.existsSync(filePath)) {
          fs.rename(filePath, NewfilePath, (error) => {
            if (error) {
              console.log(error);
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
                  } else {
                    return res.status(200).json({
                      status: true,
                      title: "Video Added Successfully.",
                    });
                  }
                }
              );
              console.log("Done");
            }
          });
        } else {
          console.log("not found");
        }
      }else{
        res.status(400).json({
          errorMessage: `File Size Must Be Less Than 50 MB`,
          status: false,
        });
      }
     
        
     
    }
  });
  // function rename(opath, newPath) {
  //   if (fs.existsSync(opath))
  //   {
  //
  //   }
  //   else
  //   {
  //       rename(opath,newPath);
  //   }
  // }
  // user.updateOne({ _id: req.body.user }, { profile: req.body.image}, function (err, docsUpdate) {
  //   if (err) {
  //     res.status(400).json({
  //       status: false,
  //       errorMessage: err,
  //     });
  //   }
  //   else
  //   {
  //     res.send("update");
  //   }
  // });
});

// All Get Data of playList
router.get("/getAlldata", (req, res) => {
  lists.find({}, function (err, data) {
    if (err) throw error;
    res.send(data);
  });
});
//  Add video in playList
router.post("/addVideoinplaylist", (req, res) => {
  playlist_id = req.body.playlist;
  let video_title = req.body.title;
  let video_url = req.body.url;
  let video_creator = "Prakash solanki";
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

module.exports = router;
