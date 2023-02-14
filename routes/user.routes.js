const express = require('express');
const bcrypt = require('bcrypt');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Session = require('../models/session.model');
const OTP = require('../models/otp.model');
const { sendOTP } = require('../services/email_sender.service');

const router = express.Router();

router.post('/signup', (req, res) => {
	User.findOne({ email: req.body.email.toLowerCase() }, (err, userOnDB) => {
		if (err) return res.status(500).send('Error on the server.');
		if (userOnDB) return res.status(400).send({ message: 'Account already exists!' });
		const user = new User({
			userId: req.body.userId,
			fullName: req.body.fullName,
			email: req.body.email.toLowerCase(),
			password: req.body.password,
		});
		bcrypt.hash(user.password, 10, (passwordErr, hash) => {
			user.password = hash;
			user.save((error) => {
				if (error) {
					return res.status(400).json({
						error: 'Error on server',
					});
				}
				return res.status(200).json({
					message: 'User created successfully',
				});
			});
		});
	});
});

router.post('/requestOTP', (req, res) => {
	const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
	const otp = new OTP({
		userId: req.body.userId,
		otp: generatedOTP,
		expiration: Date.now() + 300000,
	});
	otp.save((error) => {
		if (error) {
			return res.status(400).json(
				{ error: 'OTP could not be sent!' },
			);
		}
		User.findOne({ _id: req.body.userId }, (err, user) => {
			if (err) return res.status(500).send('Error on the server.');
			if (!user) return res.status(404).send('No user found.');
			sendOTP(user.email, generatedOTP);
			return res.status(200).send({ message: 'OTP sent!' });
		});
	});
});

router.post('/authenticate', (req, res) => {
	OTP.findOne({ userId: req.body.userId }, (err, otpData) => {
		User.findOne({ _id: req.body.userId }, (error, user) => {
			if (err) return res.status(500).send('Error on the server.');
			if (!user) return res.status(404).send('No user found.');
			if (otpData.otp !== req.body.otp) return res.status(401).send({ message: 'Invalid OTP!' });
			if (otpData.expiration < Date.now()) return res.status(401).send({ message: 'OTP expired!' });
			User.updateOne({ _id: req.body.userId }, { $set: { isAuthenticated: true } }, () => res.status(200).send({ message: 'OTP verified!' }));
		});
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
		const session = new Session({
			userId: user._id,
			token,
			expiration: Date.now() + 2592000000,
		});
		session.save((error) => {
			if (error) {
				return res.status(400).json(
					{ error: 'Error on server' },
				);
			}
			return res.status(200).json({
				message: 'User logged in successfully',
				token,
			});
		});
	});
});
