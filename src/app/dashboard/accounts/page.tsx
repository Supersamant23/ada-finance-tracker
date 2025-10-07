// src/app/dashboard/accounts/page.tsx
import AddAccountForm from "@/components/AddAccountForm";
import { createClient } from "@/lib/supabase/server";
import { addAccount } from "./actions";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: accounts, error } = await supabase.from("accounts").select("*");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Accounts
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Manage your bank accounts and financial institutions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddAccountForm />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Accounts
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {accounts?.length || 0} accounts
            </span>
          </div>
          {accounts && accounts.length > 0 ? (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {account.account_name}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {account.account_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500"
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
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                No accounts added yet
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Add your first account to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
