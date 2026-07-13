import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0.01 },
    description: { type: String, required: true, trim: true, maxlength: 160 },
    category: { type: String, required: true, trim: true, maxlength: 50 },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
