import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Button, Form, FormControl, InputGroup, Overlay, Tooltip } from 'react-bootstrap';
import { MdContentCopy } from "react-icons/md";

const CopyInvoiceButton = ({ getOneInvoice }) => {
  const navigate = useNavigate()
  const [invoiceId, setInvoiceId] = useState(null)
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [target, setTarget] = useState(null);

  const handleClick = (event) => {
    setShowNumberInput(!showNumberInput);
    setTarget(event.target);
  };

  const onChangeHandler = (e) => {
    setInvoiceId(e.target.value)
  }

  const handleSubmit = () => {
    const invoice = getOneInvoice({ invoiceId: invoiceId });
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${invoiceId}`);
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <Button onClick={handleClick} variant='dark'>
        <MdContentCopy />
      </Button>
      <Overlay target={target} show={showNumberInput} placement="top">
        {(props) => (
          <Tooltip id="copy-invoice" {...props}>
            <Form> 
              <Form.Group className="mb-3" controlId="numberInput">
                <InputGroup>
                  <FormControl type="number" placeholder="Enter number" value={invoiceId} onChange={onChangeHandler}/>
                  <Button onClick={handleSubmit} variant="outline-secondary">Search</Button>
                </InputGroup>
              </Form.Group>
            </Form>
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
};

export default CopyInvoiceButton;
