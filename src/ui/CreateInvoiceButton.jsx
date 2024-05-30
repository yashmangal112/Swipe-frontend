import React from 'react'
import { Link } from 'react-router-dom'

import { Button } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'

const CreateInvoiceButton = () => {
  return (
    <Link to="/create">
      <Button 
        className="ratio ratio-1x1 d-flex align-items-center justify-content-center p-3" 
        variant="outline-primary"
      >
        <FaPlus className='p-2'/>
      </Button>
    </Link>
  )
}

export default CreateInvoiceButton
