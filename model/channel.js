var mongoose = require('mongoose');
var Schema = mongoose.Schema;
channelSchema = new Schema({
	url: String,
	position: String,
	title: String,
	status: { type: Number, default: 0 }
}),
	channel = mongoose.model('channel', channelSchema);

module.exports = channel;