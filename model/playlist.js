var mongoose = require('mongoose');
var Schema = mongoose.Schema;

playListSchema = new Schema( {
	title:{type:String,default:""},
	url:{type:String,default:""},
	views:{type:String,default:""},
	posted_date:{type:String,default:""},
	channel_name:{type:String,default:""},
	channel_url:{type:String,default:""},
	thumbnail:{type:String,default:""},
	category:{type:String,default:""},
	locationStatus:{type:String,default:""},
	plays_at:{type:String,default:""},
	captions:{type:String,default:""},
	play_log:{type:String,default:""},
	clip_cleared:{type:String,default:""},
	clip_contact:{type:String,default:""},
	users:[{type: Schema.Types.ObjectId, ref: 'users'}],
	videos:[{type: Schema.Types.ObjectId, ref: 'videos'}],
	introVideo:{type:String,default:null},
},{ timestamps: true }),
playlists = mongoose.model('playlists', playListSchema);

module.exports = playlists;