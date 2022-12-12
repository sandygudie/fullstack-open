import React from 'react'

function Filter({searchValue,filterHandler}) {
  return (
    <div>
    Filter shown with
    <input value={searchValue} onChange={filterHandler} />
  </div>
  )
}

export default Filter