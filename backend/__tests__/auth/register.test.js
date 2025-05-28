const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../src/models/userModel");

require("dotenv").config();

const app = express();

app.use(express.json());

beforeAll(() => {
  AuthController = require("../../src/controllers/authController");
  app.post("/signup", AuthController.signup);
});

jest.mock("../../src/models/userModel");

describe("POST /signup", () => {
  it("should return 400 if fields are missing", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ username: "testuser" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid request, missing fields");
  });

  it("should return 409 if user already exists", async () => {
    User.findOne.mockResolvedValue({
      get: () => ({
        email: "test@example.com",
        id: 1,
        username: "testuser",
        role: "CUSTOMER",
      }),
    });

    const response = await request(app).post("/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User already exists");
  });

  it("should return 201 and create a new user", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      get: () => ({
        id: 1,
        username: "testuser",
        email: "test@example.com",
        password: hashedPassword,
        role: "CUSTOMER",
      }),
    });

    const response = await request(app).post("/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "CUSTOMER",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      role: "CUSTOMER",
      accessToken: expect.any(String),
    });
  });

  it("should return 500 if there is a server error", async () => {
    User.findOne.mockRejectedValue(new Error("Server error"));

    const response = await request(app).post("/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "CUSTOMER",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});
