import React from 'react'

import Button from 'react-bootstrap/Button';
import { BiSolidPencil } from "react-icons/bi";

const EditButton = ({ handlerFunction }) => {
  return (
    <Button
      className='position-absolute top-0 end-0 m-2'
      variant='light'
      onClick={handlerFunction}
    >
      <BiSolidPencil />
    </Button>
  )
}

export default EditButton
