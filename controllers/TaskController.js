const Task = require('../models/Task');

/**
 * This function will get all the tasks in the database and return them in the response.
 * This function is used in the getAllTasks route.
 * The getAllTasks route is used to get all the tasks in the database.
 * The getAllTasks route is called when the user visits the /api/tasks route.
 * The getAllTasks route will respond with all the tasks in the database.
 */
exports.getAllTasks = (req, res) => {
  Task.getAllTasks((err, tasks) => {
    if (err) return res.status(500).send(err);
    return res.json(tasks);
  });
};

/** This function gets all the subtasks for a given subtask
 * The subtasks are stored in the Subtasks collection
 * The subtask ID is passed in the request body
 * The subtask title is returned in the response body
*/
exports.getSubtasks = (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    return res.json(task.subTasks);
  });
};

/**
 * Get a task by id
 * task_id is a variable that is passed in the request
 * the id is used to retrieve a task from the database
 * the task is passed as JSON in the response
 */
exports.getTaskById = (req, res) => {
  Task.getTaskById(req.params.id, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    return res.json(task);
  });
};

/**
 * This function returns a subtask with the specified id, if it exists.
 * The function is called by the getSubtaskById function in the subtask controller.
*/

exports.getSubtaskById = (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    const subTask = task.subTasks.id(req.params.subId);
    if (!subTask) return res.status(404).send('Sub-task not found');
    return res.json(subTask);
  });
};

/**
 * This function adds a task to the database.
 * It is called when the user clicks the "Add Task" button.
 */
exports.addTask = (req, res) => {
  Task.addTask(req.body, (err, task) => {
    if (err) return res.status(500).send(err);
    return res.json(task);
  });
};

/**
 * This function adds a subtask to a task in the database.
 * The subtask is added to the subtasks array in the task.
 */
exports.addSubtask = (req, res) => {
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
};

/**
 * This function updates the task in the database
 * It updates the task with the new description and status
 * It also updates the date of the last update
 */
exports.updateTask = (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    return res.json(task);
  });
};

/**
 * Update a subtask with a given taskId and subtaskId
 * taskId is in the request body, subtaskId is in the URL
 */
exports.updateSubtask = (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) return res.status(500).send(err);
    if (!task) return res.status(404).send('Task not found');
    const subTask = task.subTasks.id(req.params.subId);
    if (!subTask) return res.status(404).send('Sub-task not found');
    subTask.set(req.body);
    return task.save((taskerr) => {
      if (err) return res.status(500).send(taskerr);
      return res.json({ message: 'Sub-task updated successfully' });
    });
  });
};

/** This function deletes a task from the database
 * It is called when the user clicks the delete button
 * It takes the task ID as a parameter
 * It returns the deleted task
*/
exports.deleteTask = (req, res) => {
  Task.findByIdAndDelete(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    return res.json({ message: 'Task deleted successfully' });
  });
};

/* This function deletes a subtask from the database.
 * It expects the subtask's ID to be passed in as a parameter in the URL.
 * It takes the subtask ID from the URL and deletes the subtask from the database.
 */
exports.deleteSubtask = (req, res) => {
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
};
