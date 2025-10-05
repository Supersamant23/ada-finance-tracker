"use client";

import { useCurrency } from "@/contexts/CurrencyContext";

interface CurrencyAmountProps {
  amount: number;
  fromCurrency?: string;
  className?: string;
  showSign?: boolean;
}

export default function CurrencyAmount({
  amount,
  fromCurrency = "INR",
  className = "",
  showSign = false,
}: CurrencyAmountProps) {
  const { formatAmount, convertAmount } = useCurrency();

  const convertedValue = convertAmount(amount, fromCurrency);
  const formattedValue = formatAmount(convertedValue);

  const displayValue = showSign
    ? amount >= 0
      ? `+${formattedValue}`
      : formattedValue
    : formattedValue;

  return <span className={className}>{displayValue}</span>;
}
