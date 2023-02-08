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
* GET all subtasks
*/
router.get('/:id/subtasks', (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    return res.json(task.subTasks);
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
* POST a new subtask with a parent task ID
*/
router.post('/:id/subtasks', (req, res) => {
  Task.findByIdAndUpdate(
    req.params.id,
    { $push: { subTasks: req.body } },
    { new: true },
    (err, task) => {
      if (err) return res.status(500).send(err);
      if (!task) return res.status(404).send('Task not found');
      return res.json(task);
    },
  );
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
* GET a specific subtask by parent task ID and subtask ID
*/
router.get('/:id/subtasks/:subId', (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    const subTask = task.subTasks.id(req.params.subId);
    if (!subTask) return res.status(404).send('Sub-task not found');
    return res.json(subTask);
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
* PUT a specific task by ID
*/
router.put('/:id/subtasks/:subId', (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    const subTask = task.subTasks.id(req.params.subId);
    if (!subTask) return res.status(404).send('Sub-task not found');
    subTask.set(req.body);
    return task.save((taskerr) => {
      if (err) return res.status(500).send(taskerr);
      return res.json({ message: 'Sub-task deleted successfully' });
    });
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

/**
* DELETE a specific task by ID
*/
router.delete('/:id/subtasks/:subId', (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    const subTask = task.subTasks.id(req.params.subId);
    if (!subTask) return res.status(404).send('Sub-task not found');
    subTask.remove();
    return task.save((taskerr) => {
      if (err) return res.status(500).send(taskerr);
      return res.json({ message: 'Sub-task deleted successfully' });
    });
  });
});

module.exports = router;
