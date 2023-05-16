const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({
    extended: true
}));
// mongoose.connect('mongodb://localhost/oatvadmindb', { useNewUrlParser: true, useUnifiedTopology: true });
// const mongooseConnectDB = require("../../mangoose.db.connect.js");
// mongooseConnectDB();
var lists = require("../../model/playlist.js");
var playList_video = require("../../model/videos.js");


router.post('/add', (req, res) => 
{


    var playlist = req.body.playlist;
    var video = req.body.video;
    lists.findById(playlist,function(err,docs)
    {
         var oldData = docs.videos;
         if(oldData.indexOf(video) == -1)
         {
            oldData.push(video);
            lists.findOneAndUpdate({ _id: docs._id },{ videos: oldData },function(err,docsUpdate)
            {
                if(err)
                {
                    res.send(err)
                }
                else
                {
                    res.status(200).json({
                        status: true,
                        title: "Video Added Successfully in "+docs.title+" Playlist"
                    });
                }
                
            });
        } 
        else
        {
            res.status(200).json({
                status: false,
                title: "This Video Alreday Exist in "+docs.title
            });
        }

    });
        
});




module.exports = router;
