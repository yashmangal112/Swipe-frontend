import React from 'react'

import Button from 'react-bootstrap/Button';
import { FaCheck } from "react-icons/fa";

const CheckButton = ({ handlerFunction }) => {
  return (
    <Button
      className='position-absolute top-0 end-0 m-2 bg-success text-white'
      variant='light'
      onClick={handlerFunction}
    >
      <FaCheck />
    </Button>
  )
}

export default CheckButton
