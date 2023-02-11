const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const router = express.Router();

router.post('/signup', (req, res) => {
	const user = new User({
		fullName: req.body.fullName,
		email: req.body.email,
		password: req.body.password,
	});

	bcrypt.hash(user.password, 10, (err, hash) => {
		user.password = hash;
		user.save((error) => {
			if (error) {
				return res.status(400).json({
					error,
				});
			}
			return res.status(200).json({
				message: 'Sign up successful!',
			});
		});
	});
});

router.post('/signin', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) return res.status(500).send('Error on the server.');
		if (!user) return res.status(404).send('No user found.');

		user.comparePassword(req.body.password, (passwordErr, isMatch) => {
			if (passwordErr) return res.status(500).send('Error on the server.');
			if (!isMatch) return res.status(401).send('Wrong password.');
			const payload = { userId: user._id };
			const secret = process.env.JWT_SECRET;
			const options = { expiresIn: '1 month' };
			const token = jwt.sign(payload, secret, options);
			res.status(200).send({ auth: true, token });
		});
	});
});

router.post('/signin', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) return res.status(500).send('Error on the server.');
		if (!user) return res.status(404).send('No user found.');

		user.comparePassword(req.body.password, (passwordErr, isMatch) => {
			if (passwordErr) return res.status(500).send('Error on the server.');
			if (!isMatch) return res.status(401).send('Wrong password.');
			const payload = { userId: user._id };
			const secret = process.env.JWT_SECRET;
			const options = { expiresIn: '1 month' };
			const token = jwt.sign(payload, secret, options);
			res.status(200).send({ auth: true, token });
		});
	});
});

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
	User.findOne({ googleId: profile.id })
		.then((existingUser) => {
			if (existingUser) {
				// we already have a record with the given profile ID
				done(null, existingUser);
			} else {
				// we don't have a user record with this ID, make a new record
				new User({ googleId: profile.id })
					.save()
					.then((user) => done(null, user));
			}
		});
}));

// Google OAuth route
router.get('/auth/google', passport.authenticate('google', {
	scope: ['profile', 'email'],
}));

// callback route for Google to redirect to
router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
	// redirect to dashboard or profile page
	res.redirect('/');
});
