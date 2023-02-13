// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// const getTransport = () => {
// // create reusable transporter object using the default SMTP transport
// 	const transport = nodemailer.createTransport({
// 		host: process.env.EMAIL_HOST,
// 		port: process.env.EMAIL_PORT,
// 		secure: true,
// 		auth: {
// 			user: process.env.EMAIL_USERNAME,
// 			pass: process.env.EMAIL_PASSWORD,
// 		},
// 	});
// 	return transport;
// };

const fetcHTML = async (OTP) => {
	const filePath = path.join(__dirname, '../views/OTPEmail.view.html');
	const html = fs.readFileSync(filePath, 'utf8');
	return html.replace('{{OTP}}', OTP);
};

exports.sendOTP = (recepientEmail, OTP) => {
	let OTP_HTML = '';
	fetcHTML(OTP).then((html) => {
		OTP_HTML = html;
	});
	// create reusable transporter object using the default SMTP transport
	nodemailer.createTestAccount((err, testAccount) => {
	// create reusable transporter object using the default SMTP transport
		if (err) {
			console.error(`Failed to create a testing account. ${err.message}`);
			return process.exit(1);
		}
		const transport = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: testAccount.user, // generated ethereal user
				pass: testAccount.pass, // generated ethereal password
			},
		});
		transport.sendMail({
			from: '"Fred Foo 👻" <foo@example.com>', // sender address
			to: 'bar@example.com', // list of receivers
			subject: 'Hello ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: OTP_HTML.toString(), // html body
		}).then((info) => {
			console.log('Message sent: %s', info.messageId);
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		});
	// getTransport().sendMail({
	// 	from: process.env.EMAIL_USERNAME,
	// 	to: recepientEmail,
	// 	subject: 'Verification code for account setup',
	// 	text: `OTP: ${OTP}`,
	// 	html: OTP_HTML,
	// }).then((info) => {
	// 	console.log('Message sent: %s', info.messageId);
	// }).catch((error) => {
	// 	console.log(error);
	// });
	});
};
