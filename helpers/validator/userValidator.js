const {check, body} = require("express-validator");

let validateRegisterUser = (req) => {
	return [ 
		body("*").trim().escape(),
		check("fullName", "Full name does not allow empty").not().isEmpty(),
		check("email", "Email does not allow empty").not().isEmpty(),
		check("email", "Invalid Email").isEmail(),
		check("email", "Email is maximum 100 characters").isLength({ max: 100 }),
		check("password", "Password does not Empty").not().isEmpty(),
		check("password", "Password is maximum 50 characters").isLength({max:50}),
		check("password", "Password is minimum 8 characters").isLength({min:8}),
		check("confirmPassword", "Passwords do not match").custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Passwords do not match");
			} else {
				return value;
			}
		})
	]; 
};

let validateLogin = () => {
	return [ 
		body("*").trim().escape(),
		check("email", "Email does not allow empty").not().isEmpty(),
		check("email", "Invalid Email").isEmail(),
		check("email", "Email is maximum 100 characters").isLength({ max: 100 }),
		check("password", "Password does not Empty").not().isEmpty(),
		check("password", "Password is maximum 50 characters").isLength({ max: 50 }),
		check("password", "Password is minimum 8 characters").isLength({min:8})
	]; 
};

let userValidate = {
	validateRegisterUser: validateRegisterUser,
	validateLogin: validateLogin
};
  
module.exports = {userValidate};