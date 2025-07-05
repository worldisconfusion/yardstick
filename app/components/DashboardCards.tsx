"use client";

import { Transaction } from './TransactionList';
import { Budget } from './BudgetBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MonthlyBarChart from './MonthlyBarChart';
import CategoryPieChart from './CategoryPieChart';

interface CategorySummaryItem {
  category: string;
  total: number;
}

interface DashboardCardsProps {
  transactions: Transaction[];
  budgets: Budget[];
  month: string;
}

function getTotalExpenses(transactions: Transaction[], month: string): number {
  return transactions
    .filter((tx) => tx.date.startsWith(month))
    .reduce((sum, tx) => sum + tx.amount, 0);
}

function getCategorySummary(transactions: Transaction[], month: string): CategorySummaryItem[] {
  const summary: Record<string, number> = {};
  transactions.forEach((tx) => {
    if (tx.date.startsWith(month)) {
      summary[tx.category] = (summary[tx.category] || 0) + tx.amount;
    }
  });
  return Object.entries(summary)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

function isSameMonth(txDate: string, month: string): boolean {
  const d = new Date(txDate);
  const txMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  return txMonth === month;
}

export default function DashboardCards({ transactions, budgets, month }: DashboardCardsProps) {
  const monthTx = transactions.filter(tx => isSameMonth(tx.date, month));
  const sortedTx = [...monthTx].sort((a, b) => b.date.localeCompare(a.date));
  const recentTx = sortedTx.slice(0, 5);

  const categorySummary: Record<string, number> = {};
  monthTx.forEach(tx => {
    categorySummary[tx.category] = (categorySummary[tx.category] || 0) + tx.amount;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ₹{monthTx.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{month}</div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTx.length === 0 ? (
            <div className="text-muted-foreground text-sm">No transactions.</div>
          ) : (
            <ul className="text-sm space-y-1">
              {recentTx.map(tx => (
                <li key={tx._id ?? `${tx.date}-${tx.amount}-${tx.category}`}>
                  <span className="font-medium">{tx.description}</span> — ₹{tx.amount}{" "}
                  <span className="text-xs text-muted-foreground">({tx.category})</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Category Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Category Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(categorySummary).length === 0 ? (
            <div className="text-muted-foreground text-sm">No data.</div>
          ) : (
            <ul className="text-sm space-y-1">
              {Object.entries(categorySummary).map(([cat, amt]) => (
                <li key={cat}>
                  <span className="font-medium">{cat}</span>: ₹{amt}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Optional: Add Pie or Bar Charts here if needed */}
    </div>
  );
}
