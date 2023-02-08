const express = require('express');

const router = express.Router();
const TaskController = require('../controllers/TaskController');

/**
* GET all tasks
*/
router.get('/', TaskController.getAllTasks);

/**
* GET all subtasks of a task by ID
*/
router.get('/:id/subtasks', TaskController.getSubtasks);

/**
* POST a new task
*/
router.post('/', TaskController.AddTask);

/**
* POST a new subtask with a parent task ID
*/
router.post('/:id/subtasks', TaskController.updateSubtask);

/**
* GET a specific task by ID
*/
router.get('/:id', TaskController.updateTask);

/**
* GET a specific subtask by parent task ID and subtask ID
*/
router.get('/:id/subtasks/:subId', TaskController.getSubtaskByID);

/**
* PUT a specific task by ID
*/
router.put('/:id', TaskController.updateTask);

/**
* PUT a specific subtask by parent task ID and subtask ID
*/
router.put('/:id/subtasks/:subId', TaskController.updateSubtask);

/**
* DELETE a specific task by ID
*/
router.delete('/:id', TaskController.deleteTask);

/**
* DELETE a specific subtask by parent task ID and subtask ID
*/
router.delete('/:id/subtasks/:subId', TaskController.deleteSubtask);

module.exports = router;
