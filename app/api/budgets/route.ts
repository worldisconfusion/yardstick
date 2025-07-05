import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Budget from '@/models/Budget';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');

    let query = {};
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      query = { month };
    }

    const budgets = await Budget.find(query).sort({ month: -1, category: 1 });
    return NextResponse.json(budgets);
  } catch (error: any) {
    console.error('GET /api/budgets error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch budgets.',
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

    // Validate required fields
    if (!data.amount || !data.month || !data.category) {
      return NextResponse.json({ error: 'Amount, month, and category are required.' }, { status: 400 });
    }

    // Validate amount
    if (isNaN(data.amount) || data.amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number.' }, { status: 400 });
    }

    // Validate month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(data.month)) {
      return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM.' }, { status: 400 });
    }

    // Validate category
    const { CATEGORIES } = await import('@/lib/categories');
    if (!CATEGORIES.includes(data.category)) {
      return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
    }

    // Check for existing budget (avoid duplicates)
    const existingBudget = await Budget.findOne({ category: data.category, month: data.month });
    if (existingBudget) {
      return NextResponse.json({ error: 'Budget already exists for this category and month.' }, { status: 400 });
    }

    // Create new budget
    const budget = await Budget.create({
      amount: Number(data.amount),
      month: data.month,
      category: data.category,
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/budgets error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create budget.',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}