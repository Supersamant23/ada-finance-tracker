import { createClient } from '@/lib/supabase/server';
import AddTransactionForm from '@/components/AddTransactionForm';
import TransactionChart from '@/components/TransactionChart';

export default async function TransactionsPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: accounts },
    { data: categories },
    { data: transactionTypes },
    { data: transactions }
  ] = await Promise.all([
    supabase.from('accounts').select('*'),
    supabase.from('categories').select('*').or(`user_id.eq.${user?.id},user_id.is.null`),
    supabase.from('transaction_types').select('*'),
    supabase
      .from('transactions')
      .select('*, categories(name), transaction_types(name)')
      .order('transaction_date', { ascending: false })
  ]);

  // Separate transactions into income and expenses
  const incomeTransactions = transactions?.filter(tx => 
    tx.transaction_types?.name.toLowerCase() === 'credit'
  ) || [];
  
  const expenseTransactions = transactions?.filter(tx => 
    tx.transaction_types?.name.toLowerCase() === 'debit'
  ) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-700">Track and manage your income and expenses</p>
      </div>
      
      {/* Add Transaction Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <AddTransactionForm accounts={accounts ?? []} categories={categories ?? []} transactionTypes={transactionTypes ?? []} />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <TransactionChart transactions={transactions ?? []} />
      </div>

      {/* Transactions Grid - Income and Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Income</h3>
                <p className="text-sm text-gray-600">Money coming in</p>
              </div>
            </div>
            <span className="text-sm text-gray-600 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
              {incomeTransactions.length} transactions
            </span>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-3">
            {incomeTransactions.length > 0 ? (
              incomeTransactions.map(tx => (
                <div key={tx.id} className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-emerald-700 bg-emerald-200 px-2 py-1 rounded">
                          {tx.categories?.name}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(tx.transaction_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-lg text-emerald-600">
                        +₹{tx.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">No income recorded</p>
                <p className="text-gray-600 text-sm mt-1">Add your first income transaction</p>
              </div>
            )}
          </div>
        </div>

        {/* Expenses Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
                <p className="text-sm text-gray-600">Money going out</p>
              </div>
            </div>
            <span className="text-sm text-gray-600 bg-red-50 text-red-700 px-3 py-1 rounded-full">
              {expenseTransactions.length} transactions
            </span>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-3">
            {expenseTransactions.length > 0 ? (
              expenseTransactions.map(tx => (
                <div key={tx.id} className="p-4 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-red-700 bg-red-200 px-2 py-1 rounded">
                          {tx.categories?.name}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(tx.transaction_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-lg text-red-600">
                        -₹{tx.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">No expenses recorded</p>
                <p className="text-gray-600 text-sm mt-1">Add your first expense transaction</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {transactions?.length || 0}
          </p>
          <p className="text-sm text-gray-600">Total Transactions</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            ₹{incomeTransactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Total Income</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-red-600">
            ₹{expenseTransactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Total Expenses</p>
        </div>
      </div>
    </div>
  );
}