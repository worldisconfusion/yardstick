"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from './TransactionList';

const COLORS = [
  '#2563eb', '#f59e42', '#10b981', '#ef4444', '#a21caf', '#fbbf24', '#6366f1', '#14b8a6', '#eab308', '#6d28d9',
];

function getCategoryTotals(transactions: Transaction[]) {
  const totals: Record<string, number> = {};
  transactions.forEach((tx) => {
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
  });
  return Object.entries(totals)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);
}

export default function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
  const data = getCategoryTotals(transactions);
  if (data.length === 0) return <div className="text-gray-500 text-center">No data yet.</div>;
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 