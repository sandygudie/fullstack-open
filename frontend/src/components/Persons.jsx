import React from "react";

function Persons({ filteredBooks, deleteHandler }) {
  return (
    <>
      {filteredBooks.map((person) => (
        <div key={person.id}>
          {person.name} - {person.number}
          <button onClick={()=>deleteHandler(person.id)}> Delete</button>
        </div>
      ))}
    </>
  );
}

export default Persons;
