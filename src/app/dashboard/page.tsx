// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import SpendingChart from '@/components/SpendingChart';
import MetricCard from '@/components/MetricCard';
import AIAssistant from '@/components/AIAssistant';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>User not found.</div>;

  const [
    { data: spendingData },
    { data: totalBalance },
    { data: monthlyIncome },
    { data: monthlyExpenses }
  ] = await Promise.all([
    supabase.rpc('get_spending_by_category', { user_id_param: user.id }),
    supabase.rpc('get_total_balance', { user_id_param: user.id }),
    supabase.rpc('get_monthly_income', { user_id_param: user.id }),
    supabase.rpc('get_monthly_expenses', { user_id_param: user.id })
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your financial overview.</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Balance" value={totalBalance ?? 0} />
        <MetricCard title="This Month's Income" value={monthlyIncome ?? 0} />
        <MetricCard title="This Month's Expenses" value={monthlyExpenses ?? 0} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Details
            </button>
          </div>
          <SpendingChart data={spendingData ?? []} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Transaction</p>
                <p className="text-sm text-gray-600">Record a new expense or income</p>
              </div>
            </button>
            
            <button className="w-full flex items-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors text-left">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Account</p>
                <p className="text-sm text-gray-600">Connect a new bank account</p>
              </div>
            </button>
            
            <button className="w-full flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">View Reports</p>
                <p className="text-sm text-gray-600">Analyze your spending patterns</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}