import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CURRENCY_EXCHANGE_API } from "../data/constants";

export const getCurrencyExchangeData = createAsyncThunk(
  'currencyExchange/getData',
  async () => {
    const response = await fetch(CURRENCY_EXCHANGE_API);
    const data = await response.json();
    return data.data;
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null
};

const currencyExchangeSlice = createSlice({
  name: 'currencyExchange',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrencyExchangeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrencyExchangeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCurrencyExchangeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const selectCurrencyExchange = (state) => state.currencyExchange;

export default currencyExchangeSlice.reducer;
