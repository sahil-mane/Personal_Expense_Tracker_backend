import mongoose from 'mongoose';

export default function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense-tracker';
  return mongoose.connect(uri);
}
