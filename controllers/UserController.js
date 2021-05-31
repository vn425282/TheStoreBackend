const Users = require("../models/UserModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const jwtHelper = require("../helpers/jwt");
const  { userValidate } = require("../helpers/validator/userValidator");
const bcrypt = require("bcrypt");

// const  {decode} = require('html-entities');

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// User Schema
// function UserData(data) {
// 	this.id = data._id;
// 	this.fullName = data.fullName;
// 	this.email = data.email;
// 	this.password = data.password;
// 	this.role = data.role;
// 	this.phoneNumber = data.phoneNumber;
// 	this.address = data.address;
// 	this.image = data.image;
// }

/**
 *  Store the user object.
 *
 * @param {string}      email
 * @param {string}      password
 * @param {string}      role
 * @param {string}      phoneNumber
 * @param {string}      address
 * @param {string}      image
 *
 * @returns {Object}
 */
exports.insertUserToDB = [
	body("email", "Email must not be empty")
		.isEmail()
		.trim()
		.escape()
		.custom((value, { req }) => {
			return Users.findOne({ email: req.body.email }).then(user => {
				console.log(user);
				if (user) {
					return Promise.reject("User already exist with this email.");
				}
			});
		}),
	userValidate.validateRegisterUser(),
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(
					res,
					"Operation failed",
					{ errors: errors.array() }
				);
			}
  
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(req.body.password, salt);

			var user = new Users({
				fullName: req.body.fullName,
				email: req.body.email,
				password: hash,
				role: 0, // 0: normal user -- 1: admin
				phoneNumber: req.body.phoneNumber,
				address: req.body.address,
				image: req.body.image
			});
  
			// Save user.
			user.save(() => {
				return apiResponse.successResponse(
					res,
					"User add Success."
				);
			});

		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.addToCart = [
	auth,
	async (req, res) => {
		try {
			if(req.user) {
				Cart.findOne({user: req.user._id}).then(cart =>{
					if(cart) {
						const tempCart = new Cart(cart);
						tempCart.products.push(
							{
								productID: req.body.productID
							}
						);

						tempCart.save(() => {
							return apiResponse.successResponse(
								res,
								"Product add Success."
							);
						});
					} else {
						const cart = new Cart({
							user: req.user._id,
							products: [
								{
									productID: req.body.productID
								}
							]
						});

						cart.save(() => {
							return apiResponse.successResponse(
								res,
								"Product add Success."
							);
						});
					}
				});
			}
			
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


exports.getUserCart = [
	auth,
	async (req, res) => {
		try {
			if(req.user) {
				Cart.findOne({user: req.user._id}).then(async cart => {
					let details = [];
					for(let i = 0; i < cart.products.length; i++) {
						const productDetail = await Product.findOne({_id: cart.products[i].productID});
						details.push(productDetail);
					}
					return apiResponse.successResponseWithData(
						res,
						"Operation successful",
						details
					);
				});
			}
			
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * User login.
 * @param {string}      email
 * @param {string}      password
 * 
 * @returns boolean
 */
exports.userLogin = [
	userValidate.validateLogin(),
	function(req, res) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(
					res,
					"Operation failed",
					{ errors: errors.array() }
				);
			}
			Users.findOne({ email: req.body.email})
				.then(user => {
					if (user) {
						bcrypt.compare(req.body.password, user.password, async function(err, result) {
							if(result) {  
								//Prepare JWT token for authentication
								const userData = {
									_id: user._id,
									fullName: user.fullName,
									email: user.email,
									phoneNumber: user.phoneNumber,
									address: user.address,
									image: user.image,
									role: user.role
								};
  
								//Generated JWT token with Payload and secret.
								const token = jwtHelper.generateJWT(userData);
								userData.token = token;

								// get user cart
								Cart.findOne({user: user._id}).then(cart => {
									if(cart) {
										userData.cart = cart.products;
									}
									return apiResponse.successResponseWithData(
										res,
										"Operation success",
										userData
									);
								});
							} else {
								return apiResponse.ErrorResponse(
									res, 
									"Operation failed");
							}
						});
					} else {
						errorResponse(res);
					}
				});
		} catch (err) {
			return errorResponse(res);
		}
	}
];

exports.userAuth = [
	auth,
	function(req, res) {
		try {
			if(req.user) {
				// get user cart
				Cart.findOne({user: req.user._id}).then(cart => {
					const cloneUser = req.user;
					cloneUser.cart = cart.products;
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						cloneUser
					);
				});
			} else {
				return errorResponse(res);
			}
		} catch (err) {
			return errorResponse(res);
		}
	}
];

function errorResponse(res) {
	return apiResponse.ErrorResponse(
		res, 
		"Operation failed");
}
  