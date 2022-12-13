import React from 'react'

function PersonForm({handleNoteChange,handleNumberChange,addPerson,newName,newNumber}) {
    
  return (
    <form onSubmit={addPerson}>
    <div>
      name: <input type="text" value={newName} required onChange={handleNoteChange} />
    </div>
    <div>
      Phonenumber:{" "}
      <input type="tel" value={newNumber} required onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

export default PersonForm