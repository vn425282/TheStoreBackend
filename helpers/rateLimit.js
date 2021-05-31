const rateLimit = require("express-rate-limit");

let limiter = {};

exports.customLimiter = function (minutes = 15, max = 15, message = "Too many request created from this IP, please try again after ")
{
	return limiter = rateLimit({
		windowMs: minutes * 60 * 1000, // 15 minutes
		max: max, // limit each IP to 100 requests per windowMs
		message: message + minutes + " minutes."
	});
};
