"use client";
import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { Loader2, IndianRupee, CalendarDays, FileText, Tag } from 'lucide-react';

export interface TransactionFormProps {
  initialData?: {
    amount: string;
    date: string;
    description: string;
    category: string;
  };
  onSubmit: (data: { amount: string; date: string; description: string; category: string }) => void;
  onCancel?: () => void;
  loading?: boolean;
  editMode?: boolean;
}

export default function TransactionForm({ initialData, onSubmit, onCancel, loading, editMode }: TransactionFormProps) {
  const [form, setForm] = useState({
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.amount || !form.date || !form.description || !form.category) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      await onSubmit(form);
    } catch (error: any) {
      setError(error.message || 'Failed to save transaction');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        {/* Amount Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <IndianRupee className="h-5 w-5" />
          </div>
          <input
            type="number"
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500 focus:outline-none"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
          <label htmlFor="amount" className="absolute left-0 -top-5 py-3 text-xs text-gray-500 dark:text-gray-400">
            Amount
          </label>
        </div>

        {/* Date Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center mb-2 pointer-events-none text-gray-400">
            <CalendarDays className="h-5 w-5" />
          </div>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500 focus:outline-none"
            required
          />
          <label htmlFor="date" className="absolute left-0 -top-5 text-xs text-gray-500 dark:text-gray-400">
            Date
          </label>
        </div>

        {/* Description Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <FileText className="h-5 w-5" />
          </div>
          <input
            type="text"
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500 focus:outline-none"
            placeholder="Dinner with friends"
            required
          />
          <label htmlFor="description" className="absolute left-0 -top-5 text-xs text-gray-500 dark:text-gray-400">
            Description
          </label>
        </div>

        {/* Category Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Tag className="h-5 w-5" />
          </div>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500 focus:outline-none appearance-none"
            required
          >
            <option value="" disabled>Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <label htmlFor="category" className="absolute left-0 -top-5 text-xs text-gray-500 dark:text-gray-400">
            Category
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {editMode && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center transition-colors disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            editMode ? 'Update Transaction' : 'Add Transaction'
          )}
        </button>
      </div>
    </form>
  );
}