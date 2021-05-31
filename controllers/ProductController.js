const Product = require("../models/ProductModel");
const  { productValidator } = require("../helpers/validator/productValidator");
const { validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const multer = require("multer");

/**
 *  Store the product object.
 *
 * @param {string}      title
 * @param {string}      description
 * @param {string}      price
 * @param {string}      image
 *
 * @returns {Object}
 */

exports.insertProductToDB = [
	auth,
	productValidator.validateProductInsert(),
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

			// check the user is admin or customer
			if(req.user && req.user.role === 1) {
				return apiResponse.validationErrorWithData(
					res,
					"Operation failed",
					{ errors: "Invalid role" }
				);
			}

			Product.findOne({ image: req.body.image.replace(/&#x2F;/g, "/") }).then(product => {
				if (product) {
					var productTemp = new Product({
						title: req.body.title,
						price: req.body.price,
						description: req.body.description,
						image: product.image,
					});
        
					productTemp.save(() => {
						return apiResponse.successResponse(
							res,
							"Product add Success."
						);
					});          
				}
			});  
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.getProducts = [
	productValidator.validateProductInsert(),
	async (req, res) => {
		try {
			Product.find({ title:{ $ne: null } }).then(product => {
				return apiResponse.successResponse(
					res,
					product
				);         
			});  
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.getProductDetail = [
	productValidator.validateProductInsert(),
	async (req, res) => {
		try {
			console.log(req.params.id);
			Product.findOne({ _id: req.params.id }).then(product => {
				return apiResponse.successResponse(
					res,
					product
				);         
			});  
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.uploadImage = [
	auth,
	async (req, res) => {
		try {
			const destination = "public/uploads/images";
			let fileName = "";
			const storage = multer.diskStorage({
				destination: "./" + destination,
				filename: function(req, file, cb){
					fileName = "images-" + new Date().valueOf() + ".jpg";
					cb(null, fileName);
				}
			});

			const upload = multer({
				storage: storage,
				limits: { fileSize: 500000 },
			}).single("file");

			upload(req, res, (err) => {
				if(err) {
					return apiResponse.ErrorResponse(res, err);
				}
				let path = destination.replace("public/", "") + "/" + fileName;
				console.log(path);
				var product = new Product({
					title: "",
					price: "",
					description: "",
					image: path
				});
    
				product.save(() => {
					return apiResponse.successResponseWithData(
						res,
						"Image add Success.",
						path
					);
				});  
			});
            


		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];




var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
