var mongoose = require('mongoose');
var Schema = mongoose.Schema;
userSchema = new Schema( {
	title:String,
	file:String,
	users:[{type: Schema.Types.ObjectId, ref: 'users'}],
	thumbnail:String,
	videoName:String,
},{ timestamps: true }),
introvideos = mongoose.model('introvideos', userSchema);
module.exports = introvideos;