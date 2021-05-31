const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	name: process.env.EMAIL_SMTP_HOST,
	host: process.env.EMAIL_SMTP_HOST,
	port: process.env.EMAIL_SMTP_PORT,
	secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
	auth: {
		user: process.env.EMAIL_SMTP_USERNAME,
		pass: process.env.EMAIL_SMTP_PASSWORD
	},
	tls: {
		rejectUnauthorized: false
	}
});

exports.send = function (mailOptions)
{
	// send mail with defined transport object
	// visit https://nodemailer.com/ for more options
	return transporter.sendMail({
		from: mailOptions.from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
		to: mailOptions.to, // list of receivers e.g. bar@example.com, baz@example.com
		subject: mailOptions.subject, // Subject line e.g. 'Hello ✔'
		//text: text, // plain text body e.g. Hello world?
		html: mailOptions.html // html body e.g. '<b>Hello world?</b>'
	});
};

exports.transporter = transporter;