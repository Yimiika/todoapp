const express = require("express");
const taskController = require("../controllers/taskcontrollers");

const taskRouter = express.Router();

taskRouter.get("/", taskController.getTasks);
taskRouter.post("/add", taskController.addTask);
taskRouter.put("/:id", taskController.updateTaskStatus);
taskRouter.delete("/:id", taskController.deleteTask);

module.exports = taskRouter;
