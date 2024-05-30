import generateRandomId from "../utils/generateRandomId";

export const getInvoiceStructure = (listSize) => ({
  id: generateRandomId(),
  currentDate: new Date().toLocaleDateString(),
  invoiceNumber: listSize + 1,
  dateOfIssue: "",
  billTo: "",
  billToEmail: "",
  billToAddress: "",
  billFrom: "",
  billFromEmail: "",
  billFromAddress: "",
  notes: "",
  total: "0.00",
  subTotal: "0.00",
  taxRate: "",
  taxAmount: "0.00",
  discountRate: "",
  discountAmount: "0.00",
  currency: "US$",
  products: [],
})