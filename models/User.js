var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	 _id :String,
	 username :String,
   password : String
});

module.exports = mongoose.model('User', UserSchema);
