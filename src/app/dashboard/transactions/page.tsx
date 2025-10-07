import { createClient } from "@/lib/supabase/server";
import AddTransactionForm from "@/components/AddTransactionForm";
import TransactionChart from "@/components/TransactionChart";
import CurrencyAmount from "@/components/CurrencyAmount";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: accounts },
    { data: categories },
    { data: transactionTypes },
    { data: transactions },
  ] = await Promise.all([
    supabase.from("accounts").select("*"),
    supabase
      .from("categories")
      .select("*")
      .or(`user_id.eq.${user?.id},user_id.is.null`),
    supabase.from("transaction_types").select("*"),
    supabase
      .from("transactions")
      .select("*, categories(name), transaction_types(name)")
      .order("transaction_date", { ascending: false }),
  ]);

  // Separate transactions into income and expenses
  const incomeTransactions =
    transactions?.filter(
      (tx) => tx.transaction_types?.name.toLowerCase() === "credit"
    ) || [];

  const expenseTransactions =
    transactions?.filter(
      (tx) => tx.transaction_types?.name.toLowerCase() === "debit"
    ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track and manage your income and expenses
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <CurrencyAmount
              amount={incomeTransactions.reduce(
                (sum, tx) => sum + tx.amount,
                0
              )}
              className="text-lg font-bold text-emerald-600"
            />
            <p className="text-gray-600 dark:text-gray-400">Income</p>
          </div>
          <div className="text-center">
            <CurrencyAmount
              amount={expenseTransactions.reduce(
                (sum, tx) => sum + tx.amount,
                0
              )}
              className="text-lg font-bold text-red-600"
            />
            <p className="text-gray-600 dark:text-gray-400">Expenses</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {transactions?.length || 0}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Total</p>
          </div>
        </div>
      </div>

      {/* Main Content - 4 Columns */}
      <div className="grid grid-cols-4 gap-6">
        {/* Column 1: Add Transaction Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add Transaction
          </h3>
          <AddTransactionForm
            accounts={accounts ?? []}
            categories={categories ?? []}
            transactionTypes={transactionTypes ?? []}
          />
        </div>

        {/* Column 2: Recent Income */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600"
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
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Income
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Money coming in
                </p>
              </div>
            </div>
            <span className="text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full">
              {incomeTransactions.length}
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {incomeTransactions.length > 0 ? (
              incomeTransactions.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 bg-emerald-200 dark:bg-emerald-900/40 px-2 py-1 rounded inline-block">
                        {tx.categories?.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {new Date(tx.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                    <CurrencyAmount
                      amount={tx.amount}
                      showSign={true}
                      className="font-bold text-lg text-emerald-600 ml-3"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-emerald-600"
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
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  No income recorded
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Add your first income transaction
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Recent Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
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
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Expenses
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Money going out
                </p>
              </div>
            </div>
            <span className="text-sm bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full">
              {expenseTransactions.length}
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {expenseTransactions.length > 0 ? (
              expenseTransactions.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-400 mt-1 bg-red-200 dark:bg-red-900/40 px-2 py-1 rounded inline-block">
                        {tx.categories?.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {new Date(tx.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                    <CurrencyAmount
                      amount={-tx.amount}
                      showSign={true}
                      className="font-bold text-lg text-red-600 ml-3"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-red-600"
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
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  No expenses recorded
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Add your first expense transaction
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column 4: Recent Activity (All Transactions) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All transactions
              </p>
            </div>
            <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
              {transactions?.length || 0}
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions && transactions.length > 0 ? (
              transactions.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    tx.transaction_types?.name.toLowerCase() === "credit"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                      : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {tx.description}
                      </p>
                      <p
                        className={`text-xs mt-1 px-2 py-1 rounded inline-block ${
                          tx.transaction_types?.name.toLowerCase() === "credit"
                            ? "text-emerald-700 dark:text-emerald-400 bg-emerald-200 dark:bg-emerald-900/40"
                            : "text-red-700 dark:text-red-400 bg-red-200 dark:bg-red-900/40"
                        }`}
                      >
                        {tx.categories?.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {new Date(tx.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                    <CurrencyAmount
                      amount={
                        tx.transaction_types?.name.toLowerCase() === "credit"
                          ? tx.amount
                          : -tx.amount
                      }
                      showSign={true}
                      className={`font-bold text-lg ml-3 ${
                        tx.transaction_types?.name.toLowerCase() === "credit"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  No transactions yet
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Add your first transaction to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Section - Below Everything */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Balance History Chart
        </h3>
        <div className="h-80">
          <TransactionChart transactions={transactions ?? []} />
        </div>
      </div>
    </div>
  );
}
