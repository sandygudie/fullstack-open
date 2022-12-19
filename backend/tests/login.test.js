const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("login attempts", () => {
  test("sucessfull login", async () => {
    const loginData = {
      username: "roottesting",
      password: "sekret",
    };
    const response = await api
      .post("/api/login")
      .send(loginData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.username).toBe("roottesting");
  }, 10000);
  test("failed login", async () => {
    const loginData = {
      username: "roottesting2",
      password: "sekret",
    };
    const response = await api
      .post("/api/login")
      .send(loginData)
      .expect(401)
      .expect("Content-Type", /application\/json/);
    expect(response.body.error).toContain("invalid username or password");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
