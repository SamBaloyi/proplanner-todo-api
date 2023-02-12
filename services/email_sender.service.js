// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
const nodemailer = require('nodemailer');

const getTransport = () => {
// create reusable transporter object using the default SMTP transport
	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: true,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	return transport;
};

exports.sendOTP = (recepientEmail, OTP) => {
	// This is to be changed to a template
	const OTP_HTML = `<h1>OTP: ${OTP}</h1>`;
	getTransport().sendMail({
		from: process.env.EMAIL_USERNAME,
		to: recepientEmail,
		subject: 'Verification code for account setup',
		text: `OTP: ${OTP}`,
		html: OTP_HTML,
	}).then((info) => {
		console.log('Message sent: %s', info.messageId);
	}).catch((error) => {
		console.log(error);
	});
};
