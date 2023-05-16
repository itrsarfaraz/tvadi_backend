var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var playlist = require('./playlist.js');
userSchema = new Schema( {
	username: String,
	email: String,
	password: String,
	role: String,
	Name:{type:String,default:"Enter Name"},
	Phone:{type:String,default:"Enter Phone No."},
	Mobile:{type:String,default:"Enter Mobile No."},
	Address:{type:String,default:"Enter Address"},
	userbio:{type:String,default:"Bio"},
	userAbout:{type:String,default:"About"},
	profile:{type:String,default:null},
	registeredAt:{type:String,default:null},
	status:{type:Number,default:0}
}),
user = mongoose.model('users', userSchema);

module.exports = user;