import React from 'react'

import Button from 'react-bootstrap/Button';
import { BiTrash } from "react-icons/bi";

const EditButton = ({ handlerFunction }) => {
  return (
    <Button
      className='position-absolute top-0 m-2 bg-danger text-white'
      variant='light'
      onClick={handlerFunction}
    >
      <BiTrash />
    </Button>
  )
}

export default EditButton
