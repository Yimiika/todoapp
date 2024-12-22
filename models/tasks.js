const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskModel = new Schema({
  name: {
    type: String,
    required: [true, "Task name is required"],
  },
  state: {
    type: String,
    required: [true, "Task state is required"],
    enum: {
      values: ["pending", "completed"],
      message: "State must be either 'pending' or 'completed'",
    },
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

TaskModel.pre("save", function (next) {
  this.lastUpdatedAt = Date.now();
  next();
});

TaskModel.pre(["findOneAndUpdate", "findByIdAndUpdate"], function (next) {
  this.set({ lastUpdatedAt: Date.now() });
  next();
});

module.exports = mongoose.model("Tasks", TaskModel);
