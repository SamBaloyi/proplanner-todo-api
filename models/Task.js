const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tag: {
    name: String,
    color: String,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low', 'none'],
    default: 'none',
  },
  dueDate: {
    type: Date,
  },
  subTasks: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tag: {
      name: String,
      color: String,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low', 'none'],
      default: 'none',
    },
    dueDate: {
      type: Date,
    },
  }],
});

/**
* A method to get all tasks
* @param {Function} callback - A callback function to handle the result of the query
*/
taskSchema.statics.getAllTasks = (callback) => {
  this.find({}, callback);
};

/**
* A method to add a new task
* @param {Object} task - The task object to be added
* @param {Function} callback - A callback function to handle the result of the query
*/
taskSchema.statics.addTask = (task, callback) => {
  this.create(task, callback);
};

/**
* A method to get a task by its id
* @param {String} id - The id of the task to be retrieved
* @param {Function} callback - A callback function to handle the result of the query
*/
taskSchema.statics.getTaskById = (id, callback) => {
  this.findById(id, callback);
};

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
