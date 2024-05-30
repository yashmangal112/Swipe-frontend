// Helper function to perform currency exchange for a single item
const exchangeSingleItem = ({ item, fromCurrency, toCurrency }) => {
  const afterExchangeAmount = (item.price / fromCurrency) * toCurrency;
  return {
    ...item,
    price: afterExchangeAmount.toFixed(2),
  };
};

// Helper function to perform currency exchange for an array of items
const exchangeMultipleItems = ({ data, fromCurrency, toCurrency }) => {
  return data.map((item) => exchangeSingleItem({ item, fromCurrency, toCurrency }));
};

// Main currency exchange function
export const currencyExchange = ({ fromCurrency = 1, toCurrency, data }) => {
  if (Array.isArray(data)) {
    return exchangeMultipleItems({ data, fromCurrency, toCurrency });
  } else if (typeof data === 'object' && data !== null) {
    return exchangeSingleItem({ item: data, fromCurrency, toCurrency });
  }
};




