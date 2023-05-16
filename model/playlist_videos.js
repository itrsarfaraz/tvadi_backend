var mongoose = require('mongoose');
var Schema = mongoose.Schema;

playList_videosSchema = new Schema(
{
    title:{
        type:String,
         required:true
     },
     creator:{
         type:String,
         required:true
     },
     logo:{
         type:String,
         required:true
     },
     url:{
         type:String,
         required:true
        },
    playlist:{type:Schema.Types.ObjectId, ref: 'playlists'}
})

playlist_videos = mongoose.model('playlist_videos', playList_videosSchema);
module.exports = playlist_videos;
