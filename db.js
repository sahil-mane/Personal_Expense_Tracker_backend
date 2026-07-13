import mongoose from 'mongoose';
import dns from "dns"

dns.setServers(['1.1.1.1','8.8.8.8'])

export default function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense-tracker';
  return mongoose.connect(uri);
}
