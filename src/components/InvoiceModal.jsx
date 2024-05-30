import React, { useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";

import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import { closeInvoiceModal } from "../redux/invoiceModalSlice";
import { useInvoiceModalData } from "../redux/hooks";

const GenerateInvoice = () => {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
};

const InvoiceModal = () => {
  const dispatch = useDispatch()
  const { isOpen, invoice, items } = useInvoiceModalData();

  const closeModalHandler = useCallback(() => {
    dispatch(closeInvoiceModal())
  }, [dispatch])

  if (invoice) {
    return (
      <>
        <Modal
          show={isOpen}
          onHide={closeModalHandler}
          size="lg"
          centered
        >
          <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h6 className="fw-bold text-secondary mb-1">
                  Invoice ID: {invoice.id || ""}
                </h6>
                <h4 className="fw-bold my-2">
                  {invoice.billFrom || "John Uberbacher"}
                </h4>
                <h6 className="fw-bold text-secondary mb-1">
                  Invoice No.: {invoice.invoiceNumber || ""}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                <h5 className="fw-bold text-secondary">
                  {" "}
                  {invoice.currency} {invoice.total}
                </h5>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{invoice.billTo || ""}</div>
                  <div>{invoice.billToAddress || ""}</div>
                  <div>{invoice.billToEmail || ""}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{invoice.billFrom || ""}</div>
                  <div>{invoice.billFromAddress || ""}</div>
                  <div>{invoice.billFromEmail || ""}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{invoice.dateOfIssue || ""}</div>
                </Col>
              </Row>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th className="text-end">PRICE</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {items?.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td style={{ width: "70px" }}>{item.quantity}</td>
                        <td>
                          {item.name}
                          {item.desc && ` - ${item.desc}`}
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {invoice.currency} {item.price}
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {invoice.currency} {(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Table>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      TAX
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {`(${invoice.taxRate || 0}%)`} {invoice.currency} {invoice.taxAmount}
                    </td>
                  </tr>
                  {invoice.discountAmmount !== 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>
                        DISCOUNT
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {`(${invoice.discountRate || 0}%)`} {invoice.currency} {invoice.discountAmount}
                      </td>
                    </tr>
                  )}
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      TOTAL
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {invoice.currency} {invoice.total}
                    </td>
                  </tr>
                </tbody>
              </Table>
              {invoice.notes && (
                <div className="bg-light py-3 px-4 rounded">
                  {invoice.notes}
                </div>
              )}
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button
                  variant="primary"
                  className="d-block w-100"
                  onClick={GenerateInvoice}
                >
                  <BiPaperPlane
                    style={{ width: "15px", height: "15px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  variant="outline-primary"
                  className="d-block w-100 mt-3 mt-md-0"
                  onClick={GenerateInvoice}
                >
                  <BiCloudDownload
                    style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3" />
      </>
    );
  } else {
    return null
  }
};

export default InvoiceModal;
