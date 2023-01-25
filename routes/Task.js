const express = require('express');

const router = express.Router();
const Task = require('../models/Task');

/**
* GET all tasks
*/
router.get('/', (req, res) => {
  Task.getAllTasks((err, tasks) => {
    if (err) return res.status(500).send(err);
    return res.json(tasks);
  });
});

/**
* POST a new task
*/
router.post('/', (req, res) => {
  Task.addTask(req.body, (err, task) => {
    if (err) return res.status(500).send(err);
    return res.json(task);
  });
});

/**
* GET a specific task by ID
*/
router.get('/:id', (req, res) => {
  Task.getTaskById(req.params.id, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    return res.json(task);
  });
});

/**
* PUT a specific task by ID
*/
router.put('/:id', (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    return res.json(task);
  });
});

/**
* DELETE a specific task by ID
*/
router.delete('/:id', (req, res) => {
  Task.findByIdAndDelete(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    return res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;
