var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({
	title: { type: String, default: "" },
	url: { type: String, default: "" },
	views: { type: String, default: "" },
	posted_date: { type: String, default: "" },
	channel_name: { type: String, default: "" },
	channel_url: { type: String, default: "" },
	thumbnail: { type: String, default: "" },
	embeded_code: { type: String, default: "" },
	duration: { type: String, default: "" },
	description: { type: String, default: "" },
	category: { type: String, default: "" },
	plays_at: { type: String, default: "" },
	captions: { type: String, default: "" },
	play_log: { type: String, default: "" },
	clip_cleared: { type: String, default: "" },
	clip_contact: { type: String, default: "" },
	// catagrory:{type:String,default:""},
	likes: { type: String, default: "" },
	likes_by: { type: String, default: null },
	keywords: { type: String, default: "" },
	user_id: { type: String, default: "" },
	playlist_id: { type: String, default: "" },
	location: { type: String, default: null },
	locationStatus: { type: String, default: "" },
	MorelocationStatus: { type: String, default: "" },
	RandomlocationStatus: { type: String, default: "" },


}, { timestamps: true }),
	videos = mongoose.model('videos', userSchema);

module.exports = videos;