"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CATEGORIES } from '@/lib/categories';
import BudgetBarChart from '../components/BudgetBarChart';

interface Budget {
  _id?: string;
  category: string;
  month: string;
  amount: number;
}

const emptyForm = { category: '', month: '', amount: '' };

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [budgetsRes, txRes] = await Promise.all([
        fetch('/api/budgets'),
        fetch('/api/transactions'),
      ]);
      
      if (!budgetsRes.ok) {
        const errorData = await budgetsRes.text();
        console.error('Budgets API error:', budgetsRes.status, errorData);
        throw new Error(`Failed to fetch budgets: ${budgetsRes.status}`);
      }
      
      if (!txRes.ok) {
        const errorData = await txRes.text();
        console.error('Transactions API error:', txRes.status, errorData);
        throw new Error(`Failed to fetch transactions: ${txRes.status}`);
      }
      
      const budgetsData = await budgetsRes.json();
      const txData = await txRes.json();
      setBudgets(budgetsData);
      setTransactions(txData);
    } catch (e: any) {
      console.error('Fetch data error:', e);
      toast.error(e.message || 'Failed to fetch budgets or transactions');
    } finally {
      setLoading(false);
    }
  }

  function openAddDialog() {
    setForm({ ...emptyForm, month: selectedMonth });
    setEditId(null);
    setDialogOpen(true);
    setError('');
  }

  function openEditDialog(b: Budget) {
    setForm({
      category: b.category,
      month: b.month,
      amount: b.amount.toString(),
    });
    setEditId(b._id!);
    setDialogOpen(true);
    setError('');
  }

  function closeDialog() {
    setDialogOpen(false);
    setForm(emptyForm);
    setEditId(null);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    if (!form.category || !form.month || !form.amount) {
      setError('All fields are required.');
      setFormLoading(false);
      return;
    }
    try {
      let res;
      if (editId) {
        res = await fetch(`/api/budgets/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, amount: Number(form.amount) }),
        });
      } else {
        res = await fetch('/api/budgets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, amount: Number(form.amount) }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save budget');
      }
      toast.success(editId ? 'Budget updated!' : 'Budget set!');
      closeDialog();
      fetchData();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this budget?')) return;
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete budget');
      }
      toast.success('Budget deleted!');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-9 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Budgets</h1>
          <Button onClick={openAddDialog}>Set Budget</Button>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <div>
                <Label htmlFor="month" className='mb-3'>Month:</Label>
                <Input
                  id="month"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-52"
                />
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <BudgetBarChart transactions={transactions} budgets={budgets} month={selectedMonth} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : budgets.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No budgets set.</div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
                {budgets.map((b) => (
                  <li key={b._id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <span className="font-semibold">{b.category}</span> <span className="text-xs">({b.month})</span>
                      <span className="ml-2">Budget: ₹{b.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-end gap-2 mt-2 sm:mt-0">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(b)} disabled={formLoading}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(b._id!)} disabled={formLoading}>Delete</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        {/* Dialog for Add/Edit */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Budget' : 'Set Budget'}</DialogTitle>
              <DialogDescription>Fill in all fields to {editId ? 'edit' : 'set'} a budget.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category" className='mb-3'>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                  disabled={formLoading}
                  required
                >
                  <SelectTrigger id="category"  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="month" className='mb-3'>Month</Label>
                <Input
                  id="month"
                  name="month"
                  type="month"
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  required
                  disabled={formLoading}
                />
              </div>
              <div>
                <Label htmlFor="amount" className='mb-3'>Budget Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                  disabled={formLoading}
                />
              </div>
              {error && <div className="text-red-600 font-medium text-sm">{error}</div>}
              <DialogFooter className="gap-2">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Set Budget')}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={closeDialog} disabled={formLoading}>Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
} 