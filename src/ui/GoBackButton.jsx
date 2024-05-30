import React from 'react'
import { Link } from 'react-router-dom'

import { BiArrowBack } from "react-icons/bi";

const GoBackButton = () => {
  return (
    <Link to="/">
      <div className="d-flex align-items-center">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
            <h5>Go Back</h5>
        </div>
      </div>
    </Link>
  )
}

export default GoBackButton
