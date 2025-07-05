import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid transaction ID.' }, { status: 400 });
    }

    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Transaction deleted successfully.' });
  } catch (error: any) {
    console.error('DELETE /api/transactions/[id] error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete transaction.',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid transaction ID.' }, { status: 400 });
    }

    const data = await req.json();

    if (!data.amount || !data.date || !data.description || !data.category) {
      return NextResponse.json({ error: 'Amount, date, description, and category are required.' }, { status: 400 });
    }

    if (isNaN(data.amount) || data.amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number.' }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}/.test(data.date)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }

    const { CATEGORIES } = await import('@/lib/categories');
    if (!CATEGORIES.includes(data.category)) {
      return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
    }

    const updated = await Transaction.findByIdAndUpdate(
      id,
      {
        amount: Number(data.amount),
        date: new Date(data.date),
        description: data.description.trim(),
        category: data.category,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('PUT /api/transactions/[id] error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update transaction.',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}