// Currency configuration and utilities
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
];

export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0]; // INR

export function getCurrencyByCode(code: string): Currency {
  return SUPPORTED_CURRENCIES.find(c => c.code === code) || DEFAULT_CURRENCY;
}

export function formatCurrency(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (_error) {
    // Fallback formatting if locale is not supported
    return `${currency.symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

// Exchange rates (in a real app, you'd fetch these from an API)
export const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  INR: {
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.79,
    CAD: 0.016,
    AUD: 0.018,
    CHF: 0.011,
    CNY: 0.086,
    SGD: 0.016,
    INR: 1,
  },
  USD: {
    INR: 83.12,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CAD: 1.35,
    AUD: 1.52,
    CHF: 0.88,
    CNY: 7.24,
    SGD: 1.34,
    USD: 1,
  },
  EUR: {
    INR: 90.45,
    USD: 1.09,
    GBP: 0.86,
    JPY: 162.80,
    CAD: 1.47,
    AUD: 1.66,
    CHF: 0.96,
    CNY: 7.88,
    SGD: 1.46,
    EUR: 1,
  },
  // Add more base currencies as needed
};

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  
  const rates = EXCHANGE_RATES[fromCurrency];
  if (!rates || !rates[toCurrency]) {
    // If direct conversion not available, convert through USD
    const toUSD = EXCHANGE_RATES[fromCurrency]?.USD || 1;
    const fromUSD = EXCHANGE_RATES.USD?.[toCurrency] || 1;
    return amount * toUSD * fromUSD;
  }
  
  return amount * rates[toCurrency];
}