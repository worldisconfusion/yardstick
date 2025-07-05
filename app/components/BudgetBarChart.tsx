"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Transaction } from './TransactionList';

export interface Budget {
  _id?: string;
  category: string;
  month: string;
  amount: number;
}

function getBudgetVsActual(transactions: Transaction[], budgets: Budget[], month: string) {
  // { category: { budget, actual } }
  const actuals: Record<string, number> = {};
  transactions.forEach((tx) => {
    if (tx.date.startsWith(month)) {
      actuals[tx.category] = (actuals[tx.category] || 0) + tx.amount;
    }
  });
  const data = budgets
    .filter((b) => b.month === month)
    .map((b) => ({
      category: b.category,
      budget: b.amount,
      actual: actuals[b.category] || 0,
    }));
  return data;
}

export default function BudgetBarChart({ transactions, budgets, month }: { transactions: Transaction[]; budgets: Budget[]; month: string }) {
  const data = getBudgetVsActual(transactions, budgets, month);
  if (data.length === 0) return <div className="text-gray-500 text-center">No budgets set for this month.</div>;
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="budget" fill="#6366f1" name="Budget" />
          <Bar dataKey="actual" fill="#f59e42" name="Actual" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 