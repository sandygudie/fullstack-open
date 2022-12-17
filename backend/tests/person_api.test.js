const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Person = require("../models/person");
const helper = require("./test_helper");

beforeEach(async () => {
  await Person.deleteMany({});
  await Person.insertMany(helper.initialPersons);
}, 10000);

describe("when there is initially some notes saved", () => {
  test("persons are returned as json", async () => {
    await api
      .get("/api/persons")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all person are returned", async () => {
    const response = await api.get("/api/persons");
    expect(response.body).toHaveLength(helper.initialPersons.length);
  });

  test("a specific person is within the returned persons", async () => {
    const response = await api.get("/api/persons");

    const contents = response.body.map((r) => r.name);
    expect(contents).toContain("tuffgrill");
  });
});

describe("addition of a new person", () => {
  test("a valid person can be added", async () => {
    const newPerson = {
      name: "Sandy",
      number: "123-457890455",
    };

    await api
      .post("/api/persons")
      .send(newPerson)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const personsAtEnd = await helper.personsInDb();
    expect(personsAtEnd).toHaveLength(helper.initialPersons.length + 1);

    const contents = personsAtEnd.map((n) => n.name);
    expect(contents).toContain("Sandy");
  });

  test("invalid is not added", async () => {
    const newPerson = {
      number: "124-23",
    };

    await api.post("/api/persons").send(newPerson).expect(400);

    const personsAtEnd = await helper.personsInDb();

    expect(personsAtEnd).toHaveLength(helper.initialPersons.length);
  });
});

describe("viewing a specific note", () => {
  test("with a valid id", async () => {
    const personsAtStart = await helper.personsInDb();

    const personToView = personsAtStart[0];

    const resultPerson = await api
      .get(`/api/persons/${personToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedPersonToView = JSON.parse(JSON.stringify(personToView));

    expect(resultPerson.body).toEqual(processedPersonToView);
  });
  test("fails with statuscode 404 if person does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/api/persons/${validNonexistingId}`).expect(404);
  });

  test("fails with statuscode 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/persons/${invalidId}`).expect(400);
  });
});

describe("deletion of a note", () => {
  test("a person can be deleted", async () => {
    const personsAtStart = await helper.personsInDb();
    const personToDelete = personsAtStart[0];
    await api.delete(`/api/persons/${personToDelete.id}`).expect(204);

    const personsAtEnd = await helper.personsInDb();

    expect(personsAtEnd).toHaveLength(helper.initialPersons.length - 1);

    const contents = personsAtEnd.map((r) => r.name);

    expect(contents).not.toContain(personToDelete.name);
  });
});
test("an Id property exist", async () => {
  const personsAtStart = await helper.personsInDb();
  const personItem = personsAtStart[0];
  expect(personItem.id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
