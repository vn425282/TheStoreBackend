const jwt = require("jsonwebtoken");

const jwtData = {
	expiresIn: process.env.JWT_TIMEOUT_DURATION,
};

exports.generateJWT = function (jwtPayload) {
	jwtPayload.timestamp = Date.now();
	return jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtData, { algorithm: process.env.JWT_ALGORITHM});
};

exports.analyzeJWT = function (req) { 
	try {
		let token = req.signedCookies.token;

		const verified = jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
			if (err) {
				return err.message;
			}
			return decoded;
		});
		return verified;
	} catch(err) {
		return false;
	}
};
