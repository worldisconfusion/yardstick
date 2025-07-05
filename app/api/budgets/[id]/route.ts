import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Budget from '@/models/Budget';

// PUT: Update a budget by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid budget ID.' }, { status: 400 });
    }

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
    if (!/^[0-9]{4}-[0-9]{2}$/.test(data.month)) {
      return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM.' }, { status: 400 });
    }

    // Validate category
    const { CATEGORIES } = await import('@/lib/categories');
    if (!CATEGORIES.includes(data.category)) {
      return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
    }

    // Check for duplicate budget (same category and month, excluding current ID)
    const existingBudget = await Budget.findOne({
      category: data.category,
      month: data.month,
      _id: { $ne: id },
    });
    if (existingBudget) {
      return NextResponse.json({ error: 'Budget already exists for this category and month.' }, { status: 400 });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {
        amount: Number(data.amount),
        month: data.month,
        category: data.category,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBudget) {
      return NextResponse.json({ error: 'Budget not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedBudget);
  } catch (error: any) {
    console.error('PUT /api/budgets/[id] error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update budget.',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

// DELETE: Delete a budget by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid budget ID.' }, { status: 400 });
    }

    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return NextResponse.json({ error: 'Budget not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Budget deleted successfully.', success: true });
  } catch (error: any) {
    console.error('DELETE /api/budgets/[id] error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete budget.',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}