const express = require('express');

const taskRoutes = express.Router();
const TaskController = require('../controllers/TaskController');

/**
* GET all tasks
*/
taskRoutes.get('/', TaskController.getAllTasks);

/**
* GET all subtasks of a task by ID
*/
taskRoutes.get('/:id/subtasks', TaskController.getSubtasks);

/**
* POST a new task
*/
taskRoutes.post('/', TaskController.addTask);

/**
* POST a new subtask with a parent task ID
*/
taskRoutes.post('/:id/subtasks', TaskController.addSubtask);

/**
* GET a specific task by ID
*/
taskRoutes.get('/:id', TaskController.updateTask);

/**
* GET a specific subtask by parent task ID and subtask ID
*/
taskRoutes.get('/:id/subtasks/:subId', TaskController.getSubtaskById);

/**
* PUT a specific task by ID
*/
taskRoutes.put('/:id', TaskController.updateTask);

/**
* PUT a specific subtask by parent task ID and subtask ID
*/
taskRoutes.put('/:id/subtasks/:subId', TaskController.updateSubtask);

/**
* DELETE a specific task by ID
*/
taskRoutes.delete('/:id', TaskController.deleteTask);

/**
* DELETE a specific subtask by parent task ID and subtask ID
*/
taskRoutes.delete('/:id/subtasks/:subId', TaskController.deleteSubtask);

module.exports = taskRoutes;
