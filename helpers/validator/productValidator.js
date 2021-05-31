const {check, body} = require("express-validator");

let validateProductInsert = (req) => {
	return [ 
		body("*").trim().escape(),
		check("title", "Title does not allow empty").not().isEmpty(),
		check("description", "Description does not allow empty").not().isEmpty(),
		check("price", "Price does not allow empty").not().isEmpty(),
		check("image", "Image does not allow empty").not().isEmpty(),
	]; 
};

let productValidator = {
	validateProductInsert: validateProductInsert
};
  
module.exports = {productValidator};