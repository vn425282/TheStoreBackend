var mongoose = require("mongoose");

var CartSchema = new mongoose.Schema({
	user: {type: String, required: true},
	products: {type: Object}
}, {timestamps: true});

module.exports = mongoose.model("Cart", CartSchema, "Cart");