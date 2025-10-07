// src/components/MetricCard.tsx
"use client";

import { useCurrency } from "@/contexts/CurrencyContext";

interface MetricCardProps {
  title: string;
  value: number;
  fromCurrency?: string;
}

export default function MetricCard({
  title,
  value,
  fromCurrency = "INR",
}: MetricCardProps) {
  const { formatAmount, convertAmount } = useCurrency();

  // Convert amount if needed and format with current currency
  const convertedValue = convertAmount(value, fromCurrency);
  const formattedValue = formatAmount(convertedValue);

  // Determine card styling based on title
  const getCardStyle = (title: string) => {
    if (title.toLowerCase().includes("balance")) {
      return {
        gradient: "from-blue-500 to-blue-600",
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        ),
      };
    } else if (title.toLowerCase().includes("income")) {
      return {
        gradient: "from-emerald-500 to-emerald-600",
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
        ),
      };
    } else {
      return {
        gradient: "from-red-500 to-red-600",
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 13l-5 5m0 0l-5-5m5 5V6"
            />
          </svg>
        ),
      };
    }
  };

  const cardStyle = getCardStyle(title);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 bg-gradient-to-r ${cardStyle.gradient} rounded-lg flex items-center justify-center text-white`}
          >
            {cardStyle.icon}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {title}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formattedValue}
          </p>
          {/* <div className="flex items-center text-sm">
            <span className="text-emerald-600 font-medium">+2.5%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
