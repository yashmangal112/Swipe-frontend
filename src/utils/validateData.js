export const validateInvoiceData = ({ invoice }) => {

  const requiredFields = [
    'dateOfIssue',
    'billTo',
    'billToEmail',
    'billToAddress',
    'billFrom',
    'billFromEmail',
    'billFromAddress',
    'total',
    'subTotal',
    'currency',
    'products',
  ];

  // Check if any required field is null, undefined, or empty
  for (const field of requiredFields) {
    if (!invoice[field] && invoice[field] !== 0 && invoice[field] !== false) {
      return {
        isValid: false,
        message: `${field} is required`
      }
    }
  }

  if (invoice.products.length === 0){
    return {
      isValid: false,
      message: "Must add atleast 1 product"
    }
  }

  if (invoice.taxRate && isNaN(invoice.taxRate)) {
    return {
      isValid: false,
      message: "Invalid Tax rate"
    };
  }
  if (invoice.discountRate && isNaN(invoice.discountRate)) {
    return {
      isValid: false,
      message: "Invalid Discount rate"
    };
  }

  return {
    isValid: true
  };
};

export const validateProductData = ({ product }) => {
  const requiredFields = [
    'name',
    'price',
    'quantity',
  ];

  for (const field of requiredFields) {
    if (!product[field] && product[field] !== 0 && product[field] !== false) {
      return {
        isValid: false,
        message: `${field} is required`
      }
    }
  }

  return {
    isValid: true
  }
}