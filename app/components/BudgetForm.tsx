"use client";
import { useState, useEffect } from 'react';

export interface BudgetFormProps {
  categories: string[];
  initialData?: {
    category: string;
    month: string;
    amount: string;
  };
  onSubmit: (data: { category: string; month: string; amount: string }) => void;
  onCancel?: () => void;
  loading?: boolean;
  editMode?: boolean;
}

export default function BudgetForm({ categories, initialData, onSubmit, onCancel, loading, editMode }: BudgetFormProps) {
  const [form, setForm] = useState({ category: '', month: '', amount: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.category || !form.month || !form.amount) {
      setError('All fields are required.');
      return;
    }
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="font-medium">Category</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input input-bordered w-full px-3 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-transparent"
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="month" className="font-medium">Month</label>
        <input
          type="month"
          id="month"
          name="month"
          value={form.month}
          onChange={handleChange}
          className="input input-bordered w-full px-3 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-transparent"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="font-medium">Budget Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="input input-bordered w-full px-3 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-transparent"
          min="0.01"
          step="0.01"
          required
        />
      </div>
      {error && <div className="text-red-600 font-medium">{error}</div>}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (editMode ? 'Saving...' : 'Adding...') : (editMode ? 'Save Changes' : 'Set Budget')}
        </button>
        {editMode && onCancel && (
          <button
            type="button"
            className="bg-gray-300 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
} 