const request = require("supertest");
const app = require("../index");
const { connect } = require("./database");
const mongoose = require("mongoose");

describe("Auth: Signup and Login", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
    console.log(conn.mongoServer.getUri());
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should signup a user", async () => {
    const response = await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({
        username: "tobi",
        password: "Password123",
      });

    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/tasks");
  });

  it("should not signup a user with an existing username", async () => {
    await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({
        username: "tobi",
        password: "Password123",
      });

    const response = await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({
        username: "tobi",
        password: "Password123",
      });

    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/signup");
  });

  it("should login a user", async () => {
    await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({
        username: "tobi",
        password: "Password123",
      });

    // Send login request
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        username: "tobi",
        password: "Password123",
      });

    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/tasks");
  });

  it("should not login with incorrect password", async () => {
    await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({
        username: "tobi",
        password: "Password123",
      });

    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        username: "tobi",
        password: "WrongPassword",
      });

    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/login");
  });
});
