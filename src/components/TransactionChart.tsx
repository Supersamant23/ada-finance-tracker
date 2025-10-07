"use client";

import { useMemo } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  transaction_date: string;
  transaction_types: { name: string } | null;
}

interface TransactionChartProps {
  transactions: Transaction[];
}

export default function TransactionChart({
  transactions,
}: TransactionChartProps) {
  const {  formatAmount: _formatAmount, convertAmount: _convertAmount } = useCurrency();
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Sort transactions by date (oldest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) =>
        new Date(a.transaction_date).getTime() -
        new Date(b.transaction_date).getTime()
    );

    // Calculate cumulative balance over time
    let cumulativeBalance = 0;
    const balanceHistory = sortedTransactions.map((tx) => {
      // Add to balance if credit (income), subtract if debit (expense)
      if (tx.transaction_types?.name.toLowerCase() === "credit") {
        cumulativeBalance += tx.amount;
      } else {
        cumulativeBalance -= tx.amount;
      }

      return {
        date: tx.transaction_date,
        balance: cumulativeBalance,
        transaction: tx,
      };
    });

    return balanceHistory;
  }, [transactions]);

  const { minBalance, maxBalance, zeroLinePosition } = useMemo(() => {
    if (chartData.length === 0)
      return { minBalance: 0, maxBalance: 1000, zeroLinePosition: 50 };

    const balances = chartData.map((d) => d.balance);
    const min = Math.min(...balances, 0);
    const max = Math.max(...balances, 1000);

    // Add some padding to the range
    const padding = (max - min) * 0.1;
    const adjustedMin = min - padding;
    const adjustedMax = max + padding;

    // Calculate where the zero line should be positioned (as percentage from bottom)
    const zeroPosition =
      ((0 - adjustedMin) / (adjustedMax - adjustedMin)) * 100;

    return {
      minBalance: adjustedMin,
      maxBalance: adjustedMax,
      zeroLinePosition: zeroPosition,
    };
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p>No transaction data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart Title */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">Balance History</h4>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">Positive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Negative</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1 border-l border-b border-gray-200 min-h-0">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-12">
          <span>₹{Math.round(maxBalance / 1000)}k</span>
          <span>
            ₹{Math.round((maxBalance * 0.75 + minBalance * 0.25) / 1000)}k
          </span>
          <span>
            ₹{Math.round((maxBalance * 0.5 + minBalance * 0.5) / 1000)}k
          </span>
          <span>
            ₹{Math.round((maxBalance * 0.25 + minBalance * 0.75) / 1000)}k
          </span>
          <span>₹{Math.round(minBalance / 1000)}k</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <div
              key={i}
              className="absolute w-full border-t border-gray-100"
              style={{ bottom: `${ratio * 100}%` }}
            />
          ))}
        </div>

        {/* Zero line (special styling) */}
        <div
          className="absolute w-full border-t-2 border-gray-400 border-dashed"
          style={{ bottom: `${zeroLinePosition}%` }}
        />
        <div
          className="absolute text-xs text-gray-600 font-medium -ml-8"
          style={{ bottom: `${zeroLinePosition - 2}%` }}
        >
          ₹0
        </div>

        {/* Chart Line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          {/* Create line segments with different colors based on balance */}
          {chartData.map((point, i) => {
            if (i === 0) return null;

            const prevPoint = chartData[i - 1];
            const x1 = ((i - 1) / (chartData.length - 1)) * 100;
            const x2 = (i / (chartData.length - 1)) * 100;
            const y1 =
              100 -
              ((prevPoint.balance - minBalance) / (maxBalance - minBalance)) *
                100;
            const y2 =
              100 -
              ((point.balance - minBalance) / (maxBalance - minBalance)) * 100;

            // Determine color based on current balance
            const isPositive = point.balance >= 0;
            const strokeColor = isPositive ? "#10b981" : "#ef4444";

            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}

          {/* Data Points */}
          {chartData.map((point, i) => {
            const x = (i / (chartData.length - 1)) * 100;
            const y =
              100 -
              ((point.balance - minBalance) / (maxBalance - minBalance)) * 100;
            const isPositive = point.balance >= 0;
            const fillColor = isPositive ? "#10b981" : "#ef4444";

            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill={fillColor}
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>
                  Balance: ₹{point.balance.toLocaleString()} on{" "}
                  {new Date(point.date).toLocaleDateString()}
                  {"\n"}Transaction: {point.transaction.description} (₹
                  {point.transaction.amount})
                </title>
              </circle>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
          <span>{new Date(chartData[0]?.date).toLocaleDateString()}</span>
          {chartData.length > 1 && (
            <span>
              {new Date(
                chartData[chartData.length - 1]?.date
              ).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Current Balance Display */}
      <div className="mt-1 text-center">
        <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-50 rounded text-xs">
          <span className="text-gray-600">Current Balance:</span>
          <span
            className={`font-bold ${
              chartData[chartData.length - 1]?.balance >= 0
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            ₹{chartData[chartData.length - 1]?.balance.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
