"use client";

export interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function TransactionList({ transactions, onEdit, onDelete, loading }: TransactionListProps) {
  if (loading) {
    return <div className="text-gray-500 text-center">Loading...</div>;
  }
  if (transactions.length === 0) {
    return <div className="text-gray-500 text-center">No transactions yet.</div>;
  }
  return (
    <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
      {transactions.map((tx) => (
        <li key={tx._id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex-1">
            <div className="font-semibold">₹{tx.amount.toFixed(2)} <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{tx.category}</span></div>
            <div className="text-gray-500 text-sm">{new Date(tx.date).toLocaleDateString()} &mdash; {tx.description}</div>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium text-xs"
              onClick={() => onEdit(tx)}
              disabled={loading}
            >
              Edit
            </button>
            <button
              className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 font-medium text-xs"
              onClick={() => onDelete(tx._id!)}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
} 