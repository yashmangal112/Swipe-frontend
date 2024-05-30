export const HOME_PAGE_URL = "/"
export const CURRENCY_EXCHANGE_API = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_cVPboBUfCtjrFxxFs6jBLFins85zYzoepgpTaez8"

export const currencyOptions = [
  { value: 'US$', label: 'USD (United States Dollar)' },
  { value: '£', label: 'GBP (British Pound Sterling)' },
  { value: 'JP¥', label: 'JPY (Japanese Yen)' },
  { value: 'CA$', label: 'CAD (Canadian Dollar)' },
  { value: 'AU$', label: 'AUD (Australian Dollar)' },
  { value: 'SG$', label: 'SGD (Singapore Dollar)' },
  { value: 'CN¥', label: 'CNY (Chinese Renminbi)' },
  { value: '₹', label: 'INR (Indian Rupee)' }
];

export const currencySymbolMapping = {
  'US$': 'USD',
  '£': 'GBP',
  'JP¥': 'JPY',
  'CA$': 'CAD',
  'AU$': 'AUD',
  'SG$': 'SGD',
  'CN¥': 'CNY',
  '₹': 'INR'
}
