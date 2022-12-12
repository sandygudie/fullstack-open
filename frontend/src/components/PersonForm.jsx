import React from 'react'

function PersonForm({handleNoteChange,handleNumberChange,addPerson,newName,newNumber}) {
    
  return (
    <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} required onChange={handleNoteChange} />
    </div>
    <div>
      number:{" "}
      <input value={newNumber} required onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

export default PersonForm