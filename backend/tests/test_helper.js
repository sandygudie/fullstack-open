const Person = require("../models/person");
const User = require("../models/user");

const initialPersons = [
  {
    name: "tuffgrill",
    number: "124-234378888",
  },
  {
    name: "Dan Abramov",
    number: "128-872343457",
  },
];
const nonExistingId = async () => {
  const person = new Person({ name: "Sandy", number: "123-457890455" });
  await person.save();
  await person.remove();

  return person._id.toString();
};

const personsInDb = async () => {
  const persons = await Person.find({});
  return persons.map((person) => person.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialPersons,
  nonExistingId,
  personsInDb,
  usersInDb,
};
