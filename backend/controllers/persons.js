const personsRouter = require("express").Router();
const Person = require("../models/person");
const User = require("../models/user");

personsRouter.get("/", async (request, response) => {
  const persons = await Person.find({})
    // We can use the populate parameter for choosing the fields we want to include from the documents
    .populate("user", {
      username: 1,
      name: 1,
    });
  response.json(persons);
});

personsRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findById(body.userId);
  const person = new Person({
    name: body.name,
    number: body.number,
    user: user._id,
  });

  const savedPerson = await person.save();

  user.phonebook = user.phonebook.concat(savedPerson._id);
  await user.save();

  response.status(201).json(savedPerson);
});

personsRouter.delete("/:id", async (request, response) => {
  await Person.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

personsRouter.put("/:id", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
  };

  const updatedPerson = Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(updatedPerson);
});

personsRouter.get("/:id", async (request, response) => {
  const person = await Person.findById(request.params.id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

module.exports = personsRouter;
