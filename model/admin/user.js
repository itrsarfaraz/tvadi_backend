var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var playlist = require('./playlist.js');
userSchema = new Schema( {
	username: String,
	email: String,
	password: String,
	role: String,
	status:{type:Number,default:0}
}),
user = mongoose.model('users', userSchema);

module.exports = user;