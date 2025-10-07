// src/components/AddAccountForm.tsx
import { addAccount } from "@/app/dashboard/accounts/actions";

export default function AddAccountForm() {
  return (
    <form
      action={addAccount}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Add New Account
      </h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="account_name"
            className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
          >
            Account Name
          </label>
          <input
            type="text"
            id="account_name"
            name="account_name"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
            placeholder="e.g., HDFC Savings"
          />
        </div>

        <div>
          <label
            htmlFor="account_type"
            className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
          >
            Account Type
          </label>
          <select
            id="account_type"
            name="account_type"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            <option value="">Select account type</option>
            <option value="savings">Savings Account</option>
            <option value="checking">Checking Account</option>
            <option value="credit">Credit Card</option>
            <option value="investment">Investment Account</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Add Account
        </button>
      </div>
    </form>
  );
}
