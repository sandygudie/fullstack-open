require('dotenv').config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");
    const person = new Person({
     name: "Dan Abramov",
    number: "12-43-234345",
    });
    const otherperson = new Person({
        name: "Ada Lovelace",
        number: "39-44-5323523",
    
       });
    return (
        person.save(),
        otherperson.save()
    )
  })
  .then(() => {
    console.log("person saved!");
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
