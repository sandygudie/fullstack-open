import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((error) => error);
  }, []);

  const handleNoteChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const filterHandler = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredBooks = persons.filter((item) => {
    return item.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  const addPerson = (event) => {
    setErrorMessage("")
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find((item) => item.name === newName);

    if (existingPerson) {
      personService
        .update(existingPerson.id, personObject)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== existingPerson.id ? person : returnedPerson
            )
          );
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => setErrorMessage(error.response.data.error));
    } else {
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => setErrorMessage(error.response.data.error));
    }
  };

  const deleteHandler = (id) => {
    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      })
      .catch((error) => error);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <Filter filterHandler={filterHandler} searchValue={searchValue} />
      <h3>Add a new</h3>
      <PersonForm
        newNumber={newNumber}
        addPerson={addPerson}
        newName={newName}
        handleNoteChange={handleNoteChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons filteredBooks={filteredBooks} deleteHandler={deleteHandler} />
    </div>
  );
};

export default App;
