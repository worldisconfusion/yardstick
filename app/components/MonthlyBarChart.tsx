"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Transaction } from './TransactionList';

function getMonthlyTotals(transactions: Transaction[]) {
  const totals: Record<string, number> = {};
  transactions.forEach((tx) => {
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    totals[key] = (totals[key] || 0) + tx.amount;
  });
  const arr = Object.entries(totals)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
  // If all totals are zero, return []
  if (arr.length > 0 && arr.every((item) => item.total === 0)) return [];
  return arr;
}

export default function MonthlyBarChart({ transactions }: { transactions: Transaction[] }) {
  const data = getMonthlyTotals(transactions);
  if (data.length === 0) return <div className="text-gray-500 text-center">No data yet.</div>;
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
          <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 