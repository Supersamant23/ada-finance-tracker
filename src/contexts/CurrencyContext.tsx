"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Currency,
  DEFAULT_CURRENCY,
  getCurrencyByCode,
  formatCurrency,
  convertCurrency,
} from "@/lib/currency";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  // Load saved currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("preferred-currency");
    if (savedCurrency) {
      const currencyObj = getCurrencyByCode(savedCurrency);
      setCurrencyState(currencyObj);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("preferred-currency", newCurrency.code);
  };

  const formatAmount = (amount: number) => {
    return formatCurrency(amount, currency);
  };

  const convertAmount = (amount: number, fromCurrency: string) => {
    return convertCurrency(amount, fromCurrency, currency.code);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatAmount,
        convertAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
