"use client";

import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { SUPPORTED_CURRENCIES, Currency } from "@/lib/currency";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        <div className="flex items-center">
          <span className="text-2xl mr-3">{currency.symbol}</span>
          <div className="text-left">
            <p className="font-medium text-gray-900">{currency.name}</p>
            <p className="text-sm text-gray-600">{currency.code}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {SUPPORTED_CURRENCIES.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr)}
              className={`w-full flex items-center p-3 hover:bg-gray-50 transition-colors ${
                currency.code === curr.code
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <span className="text-2xl mr-3">{curr.symbol}</span>
              <div className="text-left flex-1">
                <p className="font-medium text-gray-900">{curr.name}</p>
                <p className="text-sm text-gray-600">{curr.code}</p>
              </div>
              {currency.code === curr.code && (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
