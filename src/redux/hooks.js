import { useSelector } from "react-redux";

import { selectCurrencyExchange } from "./currencyExchangeSlice";
import { selectInvoiceList } from "./invoicesSlice";
import { selectInvoiceModalData } from "./invoiceModalSlice";
import { selectProductList } from "./productsSlice";
import { currencyExchange } from "../utils/currencyExchange";
import { currencySymbolMapping } from "../data/constants";

export const useInvoiceListData = () => {
  const invoiceList = useSelector(selectInvoiceList);
  const { getProductById } = useProductListData();
  const { exchangeRate } = useCurrencyExchangeData()

  const getOneInvoice = ({ invoiceId }) => {
    invoiceId = parseInt(invoiceId);
    return invoiceList.find(
      (invoice) => invoice.id === invoiceId
    ) || null;
  };  

  const getAllProductsByInvoiceId = ({ invoiceId }) => {
    const { products: invoiceProducts, currency } = getOneInvoice({ invoiceId }) || {}
    const allProducts = invoiceProducts?.map(({ id, quantity }) => {
      const productFromStore = getProductById({ productId: id });
      if (productFromStore) {
        return {
          ...productFromStore,
          quantity,
        };
      }
      
      return null;
    }).filter(product => product !== null);

    let afterCurrencyConversion = allProducts
    if (exchangeRate) {
      afterCurrencyConversion = currencyExchange({
        toCurrency: exchangeRate[currencySymbolMapping[currency]], 
        data: allProducts 
      })
    }
    
    return afterCurrencyConversion || []
  }

  const listSize = invoiceList.length;

  return {
    invoiceList,
    getOneInvoice,
    getAllProductsByInvoiceId,
    listSize,
  };
};

export const useProductListData = () => {
  const { data: productList, editItemId } = useSelector(selectProductList);

  const getProductById = ({ productId }) => {
    return (
      productList.find(
        (product) => product.id === productId
      ) || null
    )
  }

  const len =  productList.length;
  const isProductListEmpty = len === 0;
  const lastProductId = productList[len-1]?.id
  
  return {
    productList,
    getProductById,
    lastProductId,
    editItemId,
    isProductListEmpty,
  };
};

export const useInvoiceModalData = () => {
  const { isOpen, invoice, items } = useSelector(selectInvoiceModalData);
  const { getAllProductsByInvoiceId } = useInvoiceListData()

  const itemsFromInvoice = getAllProductsByInvoiceId({ invoiceId: invoice?.id })
  
  return {
    isOpen,
    invoice,
    items: items || itemsFromInvoice
  };
};

export const useCurrencyExchangeData = () => {
  const { data: exchangeRate, loading, error } = useSelector(selectCurrencyExchange)

  return {
    exchangeRate,
    loading,
    error
  }
}