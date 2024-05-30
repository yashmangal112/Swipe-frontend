import { createSlice } from "@reduxjs/toolkit";
import { dummyProducts } from "../data/products";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    data: [...dummyProducts],
    editItemId: null
  },
  reducers: {
    addProduct: (state, action) => {
      const { newProduct, invoiceId } = action.payload;
      const { id, name, desc, price } = newProduct

      const existingProductIndex = state.data.findIndex((item) => item.id === id)

      // If product already exists, then don't add duplicate
      if(existingProductIndex !== -1) {
        const updatedData = [...state.data]
        const existingProduct = updatedData[existingProductIndex]

        // append the associated invoiceId in the existing product
        const updatedProduct = { id, name, desc, price, associatedInvoiceIds: [...existingProduct.associatedInvoiceIds, invoiceId]}
        updatedData[existingProductIndex] = updatedProduct
        
        return {
          ...state,
          data: updatedData
        }
      } else {
        return {
          // otherwise append invoiceId in new product and add it to the store
          ...state,
          data: [
            ...state.data, 
            { id, name, desc, price, associatedInvoiceIds: [invoiceId] }
          ]
        }
      }
    },
    deleteProduct: (state, action) => {
      const updatedData = state.data.filter((product) => product.id !== action.payload.id);

      return {
        ...state,
        data: updatedData
      }
    },
    deleteAssociatedId: (state, action) => {
      const { productId, invoiceId } = action.payload
      const productIndex = state.data.findIndex((product) => product.id === productId);

      const product = state.data[productIndex];
      product.associatedInvoiceIds = product.associatedInvoiceIds.filter(id => id !== invoiceId);

      return state
    },
    updateProduct: (state, action) => {      
      const { updatedProduct } = action.payload;
      const { id, name, desc, price } = updatedProduct
      const index = state.data.findIndex((product) => product.id === updatedProduct.id);

      if (index !== -1) {
        const updatedData = [...state.data];
        updatedData[index] = { ...updatedData[index], id, name, desc, price };
    
        return {
          ...state,
          data: updatedData
        };
      }
    
      return state;
    },
    updateEditState: (state, action) => {
      const { value } = action.payload;

      // If one item is already in edit state, can't edit another item
      if( value && state.editItemId ) return state
    
      return {
        ...state,
        editItemId: value
      }
    }
  },
});

export const {
  addProduct,
  deleteProduct,
  updateProduct,
  updateEditState,
  deleteAssociatedId
} = productsSlice.actions;

export const selectProductList = (state) => state.products;
export const productSliceInitialState = productsSlice.initialState

export default productsSlice.reducer;
