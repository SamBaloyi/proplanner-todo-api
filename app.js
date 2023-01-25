const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tasksRouter = require('./routes/Task');

mongoose.connect('mongodb://localhost:27017/proplanner-db', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/tasks', tasksRouter);

app.listen(6060, () => {
  console.log('Server started on port 6060');
});

module.exports = app;
