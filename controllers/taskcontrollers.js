const Task = require("../models/tasks");
const User = require("../models/users");

async function addTask(req, res, next) {
  try {
    const { name, state } = req.body;

    const userId = req.user._id;

    const existingTask = await Task.findOne({ name, user: userId });

    if (existingTask) {
      req.flash("error", "Task already exists");
      return res.redirect("/tasks");
    }

    const newTask = new Task({
      name,
      state,
      user: userId,
    });

    await newTask.save();

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      // API request: send JSON response
      return res.json({
        message: "Task added successfully",
        task: newTask,
      });
    } else {
      return res.redirect("/tasks");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function getTasks(req, res, next) {
  const userId = req.user._id;
  const state = req.query.state || ""; // Get the 'state' query parameter, default to an empty string

  try {
    const query = { user: userId };

    // Adds the state filter if provided
    if (state) {
      query.state = state;
    }

    // Fetches the tasks based on the query
    const tasks = await Task.find(query);

    // Renders the 'tasks.ejs' page, passing the tasks, user data, and selected state
    res.render("tasks", {
      user: req.user,
      tasks: tasks,
      state: state,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    } else {
      return res.redirect("/tasks");
    }
  } catch (err) {
    next(err);
  }
}
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.flash({ message: "Task not found" });
    } else {
      return res.redirect("/tasks");
    }
  } catch (err) {
    next(err);
  }
}
module.exports = {
  addTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
};
