import { createSlice } from "@reduxjs/toolkit";

const invoiceModalSlice = createSlice({
  name: "invoiceModal",
  initialState: {
    isOpen: false,
    invoice: null,
    items: [],
  },
  reducers: {
    openInvoiceModal: (state, action) => {
      const { invoice, items } = action.payload
      return {
        ...state,
        isOpen: true,
        invoice,
        items
      }
    },
    closeInvoiceModal: (state) => {
      return {
        ...state,
        isOpen: false,
        invoice: null
      }
    },
  },
});

export const {
  openInvoiceModal,
  closeInvoiceModal,
} = invoiceModalSlice.actions;

export const selectInvoiceModalData = (state) => state.invoiceModal;

export default invoiceModalSlice.reducer;
