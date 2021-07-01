import { useEffect, useState } from 'react'


const Box = ({ data, onClick }) => {
  return (
    <div data-testid="box" onClick={() => onClick(data.id)} >{`row: ${data.row}, column: ${data.column}`}</div>
  )
} 

export default Box;
