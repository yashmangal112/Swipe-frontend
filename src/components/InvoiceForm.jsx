import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

import { addInvoice, updateInvoice } from "../redux/invoicesSlice";
import { currencyExchange } from "../utils/currencyExchange";
import { currencyOptions, currencySymbolMapping } from "../data/constants";
import { getCurrencyExchangeData } from "../redux/currencyExchangeSlice";
import { getInvoiceStructure } from "../data/invoice";
import { handleCalculateTotal } from "../utils/calculateTotal";
import { openInvoiceModal } from "../redux/invoiceModalSlice";
import { useCurrencyExchangeData, useInvoiceListData } from "../redux/hooks";
import { validateInvoiceData } from "../utils/validateData";
import generateRandomId from "../utils/generateRandomId";
import GoBackButton from "../ui/GoBackButton"
import InvoiceItem from "./InvoiceItem";

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCopy = location.pathname.includes("create");
  const isEdit = location.pathname.includes("edit");

  const [copyId, setCopyId] = useState("");
  const { getOneInvoice, getAllProductsByInvoiceId, listSize } = useInvoiceListData();
  const { exchangeRate } = useCurrencyExchangeData()
  const [allItems, setAllItems] = useState(getAllProductsByInvoiceId({ invoiceId: params.id }))
  const [formData, setFormData] = useState(
    isEdit
      ? getOneInvoice({ invoiceId: params.id })
      : isCopy && params.id
      ? {
          ...getOneInvoice({ invoiceId: params.id }),
          id: generateRandomId(),
          invoiceNumber: listSize + 1,
        }
      : getInvoiceStructure(listSize)
  );

  useEffect(() => {
    dispatch(getCurrencyExchangeData());
  }, [dispatch]); 

  useEffect(()=>{
    if (!formData?.id) {
      navigate("/")
    }
  }, [navigate, formData])

  useEffect(() => {
    // Store only the itemId and quantity of each item in the Invoice store
    // The Idea is to fetch the complete item details from Product store based on the itemId 
    // to keep the data consistent across entire application
    setFormData((prev) => {
      return {
        ...prev,
        products: allItems.map(({ id, quantity }) => ({
          id,
          quantity
        }))
      };
    });
  }, [allItems]);

  useEffect(() => {
    updateTotalAmount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [allItems]);

  const updateTotalAmount = useCallback(() => {
    setFormData(prevFormData => {
        const dataAfterCalculation = handleCalculateTotal({ allItems, data: prevFormData });

        dispatch(updateInvoice({ updatedInvoice: dataAfterCalculation }))

        return dataAfterCalculation
      });
  }, [allItems, dispatch]);

  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
    updateTotalAmount();
  };

  const onCurrencyChange = useCallback(({ currency }) => {
    if (exchangeRate) {
      setAllItems(prev => currencyExchange({ 
        fromCurrency: exchangeRate[currencySymbolMapping[formData.currency]], 
        toCurrency: exchangeRate[currencySymbolMapping[currency]], 
        data: prev 
      }));
    }
    // set oldCurrency, then updated newCurrency
    setFormData({ ...formData, currency });
  }, [exchangeRate, formData]);

  const openModal = (event) => {
    event.preventDefault();
    updateTotalAmount();
    dispatch(openInvoiceModal({ invoice: formData, items: allItems }))
  };

  const handleAddInvoice = () => {
    updateTotalAmount()
    const { isValid, message } = validateInvoiceData({ invoice: formData })
    if (!isValid){
      toast.error(message)
      return;
    }
    
    if (isEdit) {
      dispatch(updateInvoice({ updatedInvoice: formData }));
      toast.success("Invoice updated successfuly 🥳")
    } else if (isCopy && params.id) {
      dispatch(addInvoice({ id: generateRandomId(), ...formData }));
      toast.success("Invoice added successfully")
    } else {
      dispatch(addInvoice(formData));
      toast.success("Invoice added successfully")
    }
    navigate("/");
  };

  const handleCopyInvoice = () => {
    const recievedInvoice = getOneInvoice(copyId);
    if (recievedInvoice) {
      setFormData({
        ...recievedInvoice,
        id: formData.id,
        invoiceNumber: formData.invoiceNumber,
      });
      toast.success("Invoice copied successfully")
    } else {
      toast.error("Invoice does not exists!!!!!")
    }
  };

  if (formData){
    return (
      <>
        <Form onSubmit={openModal}>
          <GoBackButton />
  
          <Row>
            <Col md={8} lg={9}>
              <Card className="p-4 p-xl-5 my-3 my-xl-4">
                <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-column">
                      <div className="mb-2">
                        <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                        <span className="current-date">{formData.currentDate}</span>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center">
                      <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                      <Form.Control
                        type="date"
                        value={formData.dateOfIssue}
                        name="dateOfIssue"
                        onChange={(e) => editField(e.target.name, e.target.value)}
                        style={{ maxWidth: "150px" }}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                    <Form.Control
                      type="number"
                      value={formData.invoiceNumber}
                      name="invoiceNumber"
                      onChange={(e) => editField(e.target.name, e.target.value)}
                      readOnly
                      min="1"
                      style={{ maxWidth: "70px" }}
                      required
                    />
                  </div>
                </div>
                <hr className="my-4" />
                <Row className="mb-5">
                  <Col>
                    <Form.Label className="fw-bold">Bill to:</Form.Label>
                    <Form.Control
                      placeholder="Who is this invoice to?"
                      rows={3}
                      value={formData.billTo}
                      type="text"
                      name="billTo"
                      className="my-2"
                      onChange={(e) => editField(e.target.name, e.target.value)}
                      autoComplete="name"
                      required
                    />
                    <Form.Control
                      placeholder="Email address"
                      value={formData.billToEmail}
                      type="email"
                      name="billToEmail"
                      className="my-2"
                      onChange={(e) => editField(e.target.name, e.target.value)}
                      autoComplete="email"
                      required
                    />
                    <Form.Control
                      placeholder="Billing address"
                      value={formData.billToAddress}
                      type="text"
                      name="billToAddress"
                      className="my-2"
                      autoComplete="address"
                      onChange={(e) => editField(e.target.name, e.target.value)}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Label className="fw-bold">Bill from:</Form.Label>
                    <Form.Control
                      placeholder="Who is this invoice from?"
                      rows={3}
                      value={formData.billFrom}
                      type="text"
                      name="billFrom"
                      className="my-2"
                      onChange={(e) => editField(e.target.name, e.target.value)}
                      autoComplete="name"
                      required
                    />
                    <Form.Control
                      placeholder="Email address"
                      value={formData.billFromEmail}
                      type="email"
                      name="billFromEmail"
                      className="my-2"
                      onChange={(e) => editField(e.target.name, e.target.value)}
                      autoComplete="email"
                      required
                    />
                    <Form.Control
                      placeholder="Billing address"
                      value={formData.billFromAddress}
                      type="text"
                      name="billFromAddress"
                      className="my-2"
                      autoComplete="address"
                      onChange={(e) => editField(e.target.name, e.target.value)}
                      required
                    />
                  </Col>
                </Row>
                <InvoiceItem
                  allItems={allItems}
                  setAllItems={setAllItems}
                  currency={formData.currency}
                  invoiceId={formData.id}
                />
                <Row className="mt-4 justify-content-end">
                  <Col lg={6}>
                    <div className="d-flex flex-row align-items-start justify-content-between">
                      <span className="fw-bold">Subtotal:</span>
                      <span>
                        {formData.currency}
                        {formData.subTotal}
                      </span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                      <span className="fw-bold">Discount:</span>
                      <span>
                        <span className="small">
                          ({formData.discountRate || 0}%)
                        </span>
                        {formData.currency}
                        {formData.discountAmount || 0}
                      </span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                      <span className="fw-bold">Tax:</span>
                      <span>
                        <span className="small">({formData.taxRate || 0}%)</span>
                        {formData.currency}
                        {formData.taxAmount || 0}
                      </span>
                    </div>
                    <hr />
                    <div
                      className="d-flex flex-row align-items-start justify-content-between"
                      style={{ fontSize: "1.125rem" }}
                    >
                      <span className="fw-bold">Total:</span>
                      <span className="fw-bold">
                        {formData.currency}
                        {formData.total || 0}
                      </span>
                    </div>
                  </Col>
                </Row>
                <hr className="my-4" />
                <Form.Label className="fw-bold">Notes:</Form.Label>
                <Form.Control
                  placeholder="Thanks for your business!"
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  as="textarea"
                  className="my-2"
                  rows={1}
                />
              </Card>
            </Col>
            <Col md={4} lg={3}>
              <div className="sticky-top pt-md-3 pt-xl-4">
                <Button
                  variant="dark"
                  onClick={handleAddInvoice}
                  className="d-block w-100 mb-2"
                >
                  {isEdit ? "Update Invoice" : "Add Invoice"}
                </Button>
                <Button variant="primary" type="submit" className="d-block w-100">
                  Review Invoice
                </Button>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Currency:</Form.Label>
                  <Form.Select
                    onChange={(event) =>
                      onCurrencyChange({ currency: event.target.value })
                    }
                    className="btn btn-light my-1"
                    aria-label="Change Currency"
                    defaultValue={formData.currency}
                  >
                    {currencyOptions.map(option => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label className="fw-bold">Tax rate:</Form.Label>
                  <InputGroup className="my-1 flex-nowrap">
                    <Form.Control
                      name="taxRate"
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => editField(e.target.name, e.target.value)}
                      className="bg-white border"
                      placeholder="0.0"
                      min="0.00"
                      step="0.01"
                      max="100.00"
                    />
                    <InputGroup.Text className="bg-light fw-bold text-secondary small">
                      %
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label className="fw-bold">Discount rate:</Form.Label>
                  <InputGroup className="my-1 flex-nowrap">
                    <Form.Control
                      name="discountRate"
                      type="number"
                      value={formData.discountRate}
                      onChange={(e) => editField(e.target.name, e.target.value)}
                      className="bg-white border"
                      placeholder="0.0"
                      min="0.00"
                      step="0.01"
                      max="100.00"
                    />
                    <InputGroup.Text className="bg-light fw-bold text-secondary small">
                      %
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
  
                <Form.Control
                  placeholder="Enter Invoice ID"
                  name="copyId"
                  value={copyId}
                  onChange={(e) => setCopyId(e.target.value)}
                  type="text"
                  className="my-2 bg-white border"
                />
                <Button
                  variant="primary"
                  onClick={handleCopyInvoice}
                  className="d-block"
                >
                  Copy Old Invoice
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </>
    );
  } else {
    return null
  }
};

export default InvoiceForm;
