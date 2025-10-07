// src/components/AddTransactionForm.tsx
'use client';

import { addTransaction } from '@/app/dashboard/transactions/actions';

type Account = {
  id: string | number;
  account_name: string;
}

type Category = {
  id: string | number;
  name: string;
}

type TransactionType = {
  id: string | number;
  name: string;
}

// We'll pass the accounts and categories to this component as props
export default function AddTransactionForm({ accounts, categories, transactionTypes }: { accounts: Account[], categories: Category[], transactionTypes: TransactionType[] }) {
  return (
    <form action={addTransaction} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Transaction</h3>

      <div className="space-y-4">
        {/* Account Selector */}
        <div>
          <label htmlFor="account_id" className="block text-sm font-medium text-gray-800 mb-2">
            Account
          </label>
          <select 
            name="account_id" 
            id="account_id" 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select an account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>{account.account_name}</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-800 mb-2">
            Amount (₹)
          </label>
          <input 
            type="number" 
            name="amount" 
            id="amount" 
            step="0.01" 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="0.00"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-2">
            Description
          </label>
          <input 
            type="text" 
            name="description" 
            id="description" 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., Grocery shopping"
          />
        </div>

        {/* Type Selector */}
        <div>
          <label htmlFor="type_id" className="block text-sm font-medium text-gray-800 mb-2">
            Transaction Type
          </label>
          <select 
            name="type_id" 
            id="type_id" 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select type</option>
            {transactionTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* Category Selector */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-800 mb-2">
            Category
          </label>
          <select 
            name="category_id" 
            id="category_id" 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
}