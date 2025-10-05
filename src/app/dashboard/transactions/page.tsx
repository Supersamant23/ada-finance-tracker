import { createClient } from '@/lib/supabase/server';
import AddTransactionForm from '@/components/AddTransactionForm';

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
    // The .limit(10) has been removed to fetch all transactions
    supabase
      .from('transactions')
      .select('*, categories(name), transaction_types(name)')
      .order('transaction_date', { ascending: false })
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-700">Track and manage your income and expenses</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddTransactionForm accounts={accounts ?? []} categories={categories ?? []} transactionTypes={transactionTypes ?? []} />
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pt-1 pb-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {transactions?.length || 0} transactions
            </span>
          </div>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-700 bg-white px-2 py-1 rounded border">
                        {tx.categories?.name}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(tx.transaction_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`font-bold text-lg ${
                        tx.transaction_types?.name.toLowerCase() === 'debit' 
                        ? 'text-red-600' 
                        : 'text-emerald-600'
                    }`}>
                      {tx.transaction_types?.name.toLowerCase() === 'debit' ? '-' : '+'}
                      ₹{tx.amount}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">
                      {tx.transaction_types?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">No transactions yet</p>
              <p className="text-gray-600 text-sm mt-1">Add your first transaction to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}