"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CATEGORIES } from '@/lib/categories';
import { format } from 'date-fns';

interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

const emptyForm = { amount: '', date: '', description: '', category: '' };

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Transactions API error:', res.status, errorData);
        throw new Error(`Failed to fetch transactions: ${res.status}`);
      }
      
      const data = await res.json();
      setTransactions(data);
    } catch (e: any) {
      console.error('Fetch transactions error:', e);
      toast.error(e.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }

  function openAddDialog() {
    setForm(emptyForm);
    setEditId(null);
    setDialogOpen(true);
    setError('');
  }

  function openEditDialog(tx: Transaction) {
    setForm({
      amount: tx.amount.toString(),
      date: tx.date.slice(0, 10),
      description: tx.description,
      category: tx.category,
    });
    setEditId(tx._id!);
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
    if (!form.amount || !form.date || !form.description || !form.category) {
      setError('All fields are required.');
      setFormLoading(false);
      return;
    }
    try {
      let res;
      if (editId) {
        res = await fetch(`/api/transactions/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, amount: Number(form.amount) }),
        });
      } else {
        res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, amount: Number(form.amount) }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save transaction');
      }
      toast.success(editId ? 'Transaction updated!' : 'Transaction added!');
      closeDialog();
      fetchTransactions();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this transaction?')) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete transaction');
      }
      toast.success('Transaction deleted!');
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-9 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button onClick={openAddDialog}>Add Transaction</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : transactions.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No transactions yet.</div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
                {transactions.map((tx) => (
                  <li key={tx._id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-semibold py-1">₹{tx.amount.toFixed(2)} <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{tx.category}</span></div>
                      <div className="text-gray-500 text-sm py-1">{format(new Date(tx.date), 'yyyy-MM-dd')} &mdash; {tx.description}</div>
                    </div>
                    <div className="flex justify-end gap-2  sm:mt-0">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(tx)} disabled={formLoading}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(tx._id!)} disabled={formLoading}>Delete</Button>
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
              <DialogTitle>{editId ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
              <DialogDescription>Fill in all fields to {editId ? 'edit' : 'add'} a transaction.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount" className='mb-2'>Amount</Label>
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
              <div>
                <Label htmlFor="date" className='mb-2'>Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  disabled={formLoading}
                />
              </div>
              <div>
                <Label htmlFor="description" className='mb-2'>Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  disabled={formLoading}
                />
              </div>
              <div>
                <Label htmlFor="category" className='mb-2'>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                  disabled={formLoading}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {error && <div className="text-red-600 font-medium text-sm">{error}</div>}
              <DialogFooter className="gap-2">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add Transaction')}
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