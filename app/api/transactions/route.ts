import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');

    let query = {};
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      query = { date: { $gte: `${month}-01`, $lte: `${month}-31` } };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch transactions.',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
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

    const transaction = await Transaction.create({
      amount: Number(data.amount),
      date: new Date(data.date),
      description: data.description.trim(),
      category: data.category,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create transaction.',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}