const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("when there is initially some users saved", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 10000);

  test("all users are returned", async () => {
    const response = await api.get("/api/users");
    const usersAtEnd = await helper.usersInDb();
    expect(response.body).toHaveLength(usersAtEnd.length);
  }, 10000);

  test("a specific user is within the returned user", async () => {
    const response = await api.get("/api/users");

    const contents = response.body.map((r) => r.username);
    expect(contents).toContain("roottesting");
  }, 10000);
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "roottesting", passwordHash });

    await user.save();
  }, 10000);

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "testinguser",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "roottesting",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username already exist");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

// work on request time