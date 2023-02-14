const express = require('express');

const app = express();
// const passport = require('passport');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tasksRouter = require('./routes/task.routes');
const authRoutes = require('./routes/user.routes');

dotenv.config({ path: './.env' });

if (process.env.NODE_ENV === 'production') {
	mongoose.connect(process.env.CONNECTION_STRING_PROD, { useNewUrlParser: true });
} else {
	mongoose.connect(process.env.CONNECTION_STRING_DEV, { useNewUrlParser: true });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(passport.initialize());
// app.use(passport.session());
app.use('/tasks', tasksRouter);
app.use('/auth', authRoutes);

app.listen(6060, () => {
	console.log('Server started on port 6060');
});

module.exports = app;
