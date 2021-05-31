var express = require("express");
var userRouter = require("./user");
var productRouter = require("./product");
var cors = require("cors");
var app = express();

var whitelist = process.env.WHITE_LIST;
var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	}
};

app.use("/user/", cors(), userRouter);
app.use("/product/", cors(), productRouter);

module.exports = app;
