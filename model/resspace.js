var mongoose = require('mongoose');
var Schema = mongoose.Schema;
userSchema = new Schema( {
	pagename: String,
	resdesc:{type:String,default:"text"},
	resimage:{type:String,default:""},
	status:{type:Number,default:0},
	imagelocation:{type:Number,default:0}
}),
resspace = mongoose.model('resspaces', userSchema);

module.exports = resspace;