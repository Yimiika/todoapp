const request = require("supertest");
const express = require("express");
const taskRouter = require("../routes/tasks");
const Task = require("../models/tasks");
const User = require("../models/users");
const session = require("express-session");
const passport = require("passport");

jest.mock("../models/tasks");
jest.mock("../models/users");

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "testsecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/tasks", taskRouter);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const mockLogin = (user) => (req, res, next) => {
  req.isAuthenticated = () => true;
  req.user = user;
  next();
};

describe("Task Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /tasks", () => {
    it("should redirect unauthenticated users to login", async () => {
      const response = await request(app).get("/tasks");

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/login");
    });

    it("should return tasks for authenticated users", async () => {
      const mockTasks = [
        { _id: "task1", name: "Task 1", state: "completed", user: "user1" },
        { _id: "task2", name: "Task 2", state: "pending", user: "user1" },
      ];

      Task.find.mockResolvedValue(mockTasks);

      app.use(mockLogin({ _id: "user1", username: "testuser" }));

      const response = await request(app).get("/tasks");

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(2);
      expect(Task.find).toHaveBeenCalledWith({ user: "user1" });
    });
  });

  describe("POST /tasks/add", () => {
    it("should redirect unauthenticated users to login", async () => {
      const response = await request(app)
        .post("/tasks/add")
        .send({ name: "New Task", state: "pending" });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/login");
    });

    it("should allow authenticated users to add a new task", async () => {
      const mockUser = { _id: "user1" };
      const mockTask = {
        _id: "task1",
        name: "New Task",
        state: "pending",
        user: mockUser._id,
      };

      User.findById.mockResolvedValue(mockUser);
      Task.findOne.mockResolvedValue(null);
      Task.prototype.save = jest.fn().mockResolvedValue(mockTask);

      app.use(mockLogin(mockUser));

      const response = await request(app)
        .post("/tasks/add")
        .send({ name: "New Task", state: "pending" });

      expect(response.status).toBe(302);
      expect(Task.prototype.save).toHaveBeenCalled();
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update a task's status for authenticated users", async () => {
      const mockTask = {
        _id: "task1",
        state: "pending",
        save: jest.fn().mockResolvedValue({ state: "completed" }),
      };

      Task.findByIdAndUpdate.mockResolvedValue(mockTask);

      app.use(mockLogin({ _id: "user1", username: "testuser" }));

      const response = await request(app)
        .put("/tasks/task1")
        .send({ state: "completed" });

      expect(response.status).toBe(302);
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        "task1",
        { state: "completed" },
        { new: true }
      );
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task for authenticated users", async () => {
      const mockTask = { _id: "task1", name: "Test Task" };

      Task.findByIdAndDelete.mockResolvedValue(mockTask);

      app.use(mockLogin({ _id: "user1", username: "testuser" }));

      const response = await request(app).delete("/tasks/task1");

      expect(response.status).toBe(302);
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith("task1");
    });
  });
});
