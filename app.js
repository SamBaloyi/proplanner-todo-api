const express = require('express');

const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tasksRouter = require('./routes/Task');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/tasks', tasksRouter);

app.listen(6060, () => {
  console.log('Server started on port 6060');
});

module.exports = app;
