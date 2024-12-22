const Task = require("../src/models/tasks"); // Adjust path as needed
const { addTask } = require("../src/controllers/taskcontrollers");

jest.mock("../src/models/tasks");

describe("addTask", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: { name: "Test Task", state: "pending" },
      user: { _id: "userId123" },
      headers: { accept: "application/json" }, // Simulate an API request
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should add a new task successfully", async () => {
    // Mock Task.findOne to return null (no existing task)
    Task.findOne.mockResolvedValue(null);

    // Mock Task constructor and save method
    const mockTask = {
      name: "Test Task",
      state: "pending",
      user: "userId123",
    };

    const mockSave = jest.fn().mockResolvedValue(mockTask);

    Task.mockImplementation(() => ({
      name: "Test Task",
      state: "pending",
      user: "userId123",
      save: mockSave, // Attach the mocked save method
    }));

    await addTask(req, res, next);

    // Assertions
    expect(Task.findOne).toHaveBeenCalledWith({
      name: "Test Task",
      user: "userId123",
    });

    expect(mockSave).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      message: "Task added successfully",
      task: {
        name: "Test Task",
        state: "pending",
        user: "userId123",
      },
    });
  });

  test("should return error if task already exists", async () => {
    // Mock Task.findOne to return an existing task
    Task.findOne.mockResolvedValue({ name: "Test Task" });

    await addTask(req, res, next);

    expect(Task.findOne).toHaveBeenCalledWith({
      name: "Test Task",
      user: "userId123",
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Task already exists" });
  });

  test("should redirect for browser requests if task exists", async () => {
    req.headers.accept = "text/html"; // Simulate browser request

    Task.findOne.mockResolvedValue({ name: "Test Task" });

    await addTask(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith("/tasks");
  });

  test("should handle errors gracefully", async () => {
    const error = new Error("Database error");
    Task.findOne.mockRejectedValue(error);

    await addTask(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
