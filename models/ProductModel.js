var mongoose = require("mongoose");

var ProductsSchema = new mongoose.Schema({
	title: {type: String},
	price: {type: String},
	description: {type: String},
	image: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Products", ProductsSchema, "Products");