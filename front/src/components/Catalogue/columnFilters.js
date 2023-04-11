import React from 'react'

export const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column
  return (
    <span >Filter:{' '}
    <input className="border"
      value={filterValue || ''}
      onChange={e => setFilter(e.target.value)}
    /></span>
    
  )
}