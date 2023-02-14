const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	userID: {
		type: String,
		required: true,
	},
	fullName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	isAuthenticated: {
		type: Boolean,
		default: false,
	},
	twoFactorAuth: {
		type: Boolean,
		default: false,
	},
});

userSchema.statics.signUp = (user, callback) => {
	this.create(user, callback);
};

userSchema.statics.logIn = (email, password, callback) => {
	this.findOne({ email, password }, callback);
};

userSchema.methods.updateInfo = (update, callback) => {
	this.updateOne(update, callback);
};

userSchema.methods.setUp2FA = (secret, callback) => {
	this.updateOne({ twoFactorAuth: secret }, callback);
};

userSchema.methods.comparePassword = (password, callback) => {
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

const User = mongoose.model('User', userSchema);
module.exports = User;
