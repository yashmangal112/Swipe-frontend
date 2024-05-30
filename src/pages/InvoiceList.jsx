import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { Button, ButtonGroup, Card, Col, Container, Row, Table } from "react-bootstrap";
import { FaExternalLinkAlt } from "react-icons/fa";

import { deleteInvoice, updateInvoice } from "../redux/invoicesSlice";
import { handleCalculateTotal } from "../utils/calculateTotal";
import { openInvoiceModal } from "../redux/invoiceModalSlice";
import { useInvoiceListData } from "../redux/hooks";
import CopyInvoiceButton from "../ui/CopyInvoiceButton";
import CreateInvoiceButton from "../ui/CreateInvoiceButton";
import { toast } from 'react-hot-toast';

const InvoiceList = () => {
  const { invoiceList, getOneInvoice, getAllProductsByInvoiceId } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();
  const handleCopyClick = () => {
    const invoice = getOneInvoice({ invoiceId: copyId });
    if (!invoice) {
      toast.error(`Invoice not found for id: ${copyId}`)
    } else {
      toast.success("Invoice copied successfully")
      navigate(`/create/${copyId}`);
    }
  };

  return (
    <div className="App d-flex flex-column align-items-center justify-content-center w-100">
      <Container>
        <Row>
          <Col className="mx-auto" xs={12} md={12} lg={9}>
            <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment by
            <a href="https://github.com/yashmangal112" target="_blank" style={{marginLeft: '5px', textDecoration: 'none'}} rel="noreferrer">
              Yash Mangal
            </a>
            </h3>
            <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
              {isListEmpty ? (
                <div className="d-flex flex-column align-items-center">
                  <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
                  <div className="d-flex align-items-center justify-content-center gap-4">
                    <Link to="/create">
                      <Button variant="primary">Create Invoice</Button>
                    </Link>
                    <Link to="/products">
                      <Button variant="primary" className="d-flex gap-2 align-items-center">
                        Products
                        <FaExternalLinkAlt />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row align-items-center justify-content-between mb-2">
                    <div className="d-flex flex-row align-items-center gap-3">
                      <h3 className="fw-bold">Invoice List</h3>
                      <div className="d-none d-md-block">
                        <CreateInvoiceButton />
                      </div>
                    </div>
                    <div className="position-fixed bottom-0 end-0 p-3 d-md-none">
                      <div className="d-flex flex-column gap-2">
                        <CopyInvoiceButton getOneInvoice={getOneInvoice} />
                        <CreateInvoiceButton />
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Link to="/products">
                        <Button variant="primary">
                          Products
                        </Button>
                      </Link>
                      <div className="d-none d-md-flex gap-2">
                        <Button variant="dark d-none d-md-block" onClick={handleCopyClick}>
                          Copy Invoice
                        </Button>

                        <input
                          type="text"
                          value={copyId}
                          onChange={(e) => setCopyId(e.target.value)}
                          placeholder="Enter Invoice ID to copy"
                          className="bg-white border"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <thead>
                        <tr>
                          <th>Invoice No.</th>
                          <th>Bill To</th>
                          <th>Due Date</th>
                          <th>Total Amt.</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceList.map((invoice) => (
                          <InvoiceRow
                            key={invoice.id}
                            invoice={invoice}
                            navigate={navigate}
                            getAllProductsByInvoiceId={getAllProductsByInvoiceId}
                          />
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        </Container>
    </div>
  );
};

const InvoiceRow = ({ invoice, navigate, getAllProductsByInvoiceId }) => {
  const dispatch = useDispatch();

  const openModal = useCallback(() => {
    dispatch(openInvoiceModal({ invoice }))
  }, [dispatch, invoice]);

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
    toast.success("Deleted successfully")
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  useEffect(() => {
    const allItems = getAllProductsByInvoiceId({ invoiceId: invoice.id })
    const updatedInvoice = handleCalculateTotal({ allItems, data: invoice })
    dispatch(updateInvoice({ updatedInvoice }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return (
    <>
      <tr>
        <td>{invoice.invoiceNumber}</td>
        <td className="fw-normal">{invoice.billTo}</td>
        <td className="fw-normal">{invoice.dateOfIssue}</td>
        <td className="fw-normal">
          {invoice.currency}
          {invoice.total}
        </td>
        <td style={{ width: "5%" }}>
          <ButtonGroup>
            <Button variant="outline-primary" onClick={handleEditClick}>
              <div className="d-flex align-items-center justify-content-center gap-2">
                <BiSolidPencil />
              </div>
            </Button>
            <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
              <div className="d-flex align-items-center justify-content-center gap-2">
                <BiTrash />
              </div>
            </Button>
            <Button variant="secondary" onClick={openModal}>
              <div className="d-flex align-items-center justify-content-center gap-2">
                <BsEyeFill />
              </div>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  );
};

export default InvoiceList;
