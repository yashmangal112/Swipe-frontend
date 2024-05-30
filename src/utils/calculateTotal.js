export const calculateSubTotal = ({ items }) => {
  let subTotal = 0;

  items.forEach((item) => {
    subTotal += parseFloat(item.price) * parseInt(item.quantity);
  });

  return subTotal.toFixed(2);
};

export const calculateTaxAmount = ({ subTotal, taxRate }) => {
  return (parseFloat(subTotal) * (parseFloat(taxRate || 0) / 100)).toFixed(2);
};

export const calculateDiscountAmount = ({ subTotal, discountRate }) => {
  return (parseFloat(subTotal) * (parseFloat(discountRate || 0) / 100)).toFixed(2);
};

export const handleCalculateTotal = ({ allItems, data }) => {
  const subTotal = calculateSubTotal({ items: allItems });
  const taxAmount = calculateTaxAmount({ subTotal, taxRate: data.taxRate });
  const discountAmount = calculateDiscountAmount({ subTotal, discountRate: data.discountRate });

  const total = (
    parseFloat(subTotal) -
    parseFloat(discountAmount) +
    parseFloat(taxAmount)
  ).toFixed(2);

  return {
    ...data,
    subTotal,
    taxAmount,
    discountAmount,
    total,
  }
}
