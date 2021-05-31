var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	email: {type: String, required: true},
	password: {type: String, required: true},
	fullName: {type: String, required: true},
	role: {type: String, required: true},
	phoneNumber: {type: String, required: true},
	address: {type: String, required: true},
	image: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Users", UserSchema, "Users");