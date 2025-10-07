// src/app/dashboard/settings/page.tsx
import { createClient } from "@/lib/supabase/server";
import CurrencySelector from "@/components/CurrencySelector";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch only the user's custom categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("user_id", user!.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-700">
          Manage your account preferences and custom categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Currency Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Currency Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Currency
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Choose your preferred currency for displaying amounts throughout
                the app. All amounts will be automatically converted from their
                original currency.
              </p>
              <CurrencySelector />
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Currency Conversion
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Exchange rates are updated regularly. Historical
                    transactions maintain their original values but are
                    displayed in your selected currency for consistency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Custom Categories
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Add New
            </button>
          </div>
          {categories && categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="font-medium text-gray-900">
                    {category.name}
                  </span>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">No custom categories</p>
              <p className="text-gray-600 text-sm mt-1">
                Create custom categories to organize your transactions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Account Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">
                Receive updates about your transactions
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              Enabled
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-600">
                Download your financial data
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Auth</p>
              <p className="text-sm text-gray-600">
                Add extra security to your account
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Setup
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">
                Permanently delete your account
              </p>
            </div>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
