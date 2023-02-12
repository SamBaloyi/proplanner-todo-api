const express = require('express');
const bcrypt = require('bcrypt');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendOTP } = require('../services/email_sender.service');

const router = express.Router();

router.post('/signup', (req, res) => {
	const user = new User({
		fullName: req.body.fullName,
		email: req.body.email.toLowerCase(),
		password: req.body.password,
	});

	bcrypt.hash(user.password, 10, (err, hash) => {
		user.password = hash;
		const OTP = Math.floor(1000 + Math.random() * 9000);
		user.OTP = OTP;
		user.save((error) => {
			if (error) {
				return res.status(400).json({
					error,
				});
			}
			sendOTP(user.email, OTP);
			return res.status(200).json({
				message: 'Sign up successful! OTP has been sent to your email.',
			});
		});
	});
});

router.post('/authenticate', (req, res) => {
	User.findOne({ email: req.body.email.toLowerCase(), OTP: req.body.OTP }, (err, user) => {
		const { OTP } = req.body;
		if (err) return res.status(500).send('Error on the server.');
		if (!user) return res.status(404).send('No user found.');
		if (OTP !== user.OTP) return res.status(401).send({ message: 'Invalid OTP!' });
		res.status(200).send({ message: 'OTP verified!' });
	});
});

router.post('/signin', (req, res) => {
	User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
		if (err) return res.status(500).send('Error on the server.');
		if (!user) return res.status(404).send('No user found.');
		const passwordIsValid = bcrypt.compareSync(
			req.body.password,
			user.password,
		);
		if (!passwordIsValid) {
			return res.status(401).send({ message: 'Invalid Password!' });
		}
		const payload = { userId: user._id };
		const secret = process.env.JWT_SECRET;
		const options = { expiresIn: '1m' };
		const token = jwt.sign(payload, secret, options);
		res.status(200).send({ token });
	});
});

module.exports = router;
// passport.use(new GoogleStrategy({
// 	clientID: process.env.GOOGLE_CLIENT_ID,
// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// 	callbackURL: process.env.GOOGLE_CALLBACK_URL,
// }, (accessToken, refreshToken, profile, done) => {
// 	User.findOne({ googleId: profile.id })
// 		.then((existingUser) => {
// 			if (existingUser) {
// 				// we already have a record with the given profile ID
// 				done(null, existingUser);
// 			} else {
// 				// we don't have a user record with this ID, make a new record
// 				new User({ googleId: profile.id })
// 					.save()
// 					.then((user) => done(null, user));
// 			}
// 		});
// }));

// // Google OAuth route
// router.get('/auth/google', passport.authenticate('google', {
// 	scope: ['profile', 'email'],
// }));

// // callback route for Google to redirect to
// router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
// 	// redirect to dashboard or profile page
// 	res.redirect('/');
// });
