const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	expiration: {
		type: String,
		required: true,
	},
});

const OTP = mongoose.model('Otp', OtpSchema);

module.exports = OTP;
