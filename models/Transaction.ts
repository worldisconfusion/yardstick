import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  date: string; // ISO date string
  description: string;
  category: string;
}

const TransactionSchema = new Schema<ITransaction>({
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
});

export default models.Transaction || model<ITransaction>('Transaction', TransactionSchema); 