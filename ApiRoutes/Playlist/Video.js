const express = require('express');
// Router
const router = express.Router();
// DataBase
// const mongoose = require('mongoose');
// For Get From Data
const bodyParser = require('body-parser');

const cors = require('cors');
router.use(cors());

//  Connect Database
// mongoose.connect('mongodb://localhost/oatvadmindb', { useNewUrlParser: true, useUnifiedTopology: true });
// Use Model 
var videos = require("../../model/videos.js");
var lists = require("../../model/playlist.js");


router.use(express.json());
router.use(express.urlencoded({
  extended: true
}));

//  For Add Data
router.post("/add", (req, res) => {
  // Get All Data       
  let Videos = new videos({
    title: req.body.title,
    url: req.body.url,
    views: req.body.views,
    likes: req.body.likes,
    posted_date: req.body.posted_date,
    duration: req.body.duration,
    keywords: req.body.keywords,
    channel_name: req.body.channel_name,
    channel_url: req.body.channel_url,
    thumbnail: req.body.thumbnail,
    description: req.body.description,
    embeded_code: req.body.embeded_code,
    category: req.body.category,
    plays_at: req.body.plays_at,
    captions: req.body.captions
  });
  //  Save Data
  Videos.save((err, data) => {
    if (err) {
      res.status(400).json({
        errorMessage: err,
        status: false
      });
    } else {
      if (req.body.by == 'youtube') {
        var newVideoId = data._id;
        var playList = req.body.playlist;
        lists.findById(playList, function (err, docs) {
          var oldData = docs.videos;
          if (oldData.indexOf(newVideoId) == -1) {
            oldData.push(newVideoId);
            lists.findOneAndUpdate({ _id: docs._id }, { videos: oldData }, function (err, docsUpdate) {
              if (err) {
                res.send(err)
              }
              else {
                res.status(200).json({
                  status: true,
                  title: "Video Added Successfully in " + docs.title + " Playlist"
                });
              }

            });
          }
          else {
            res.status(200).json({
              status: false,
              title: "This Video Alreday Exist in " + docs.title
            });
          }

        });
        res.send()
      }
      else {
        res.status(200).json({
          status: true,
          title: 'Add Video Successfully.'
        });
      }
    }
  });
});


router.post('/delete', (req, res) => {
  videos.deleteOne({ _id: req.body.ids }, function (err) {
    if (err) {
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
})

router.get("/getAlldata", (req, res) => {
  videos.find({}, function (err, data) {
    if (err) throw error;
    res.send(data);
  });
});


module.exports = router;
