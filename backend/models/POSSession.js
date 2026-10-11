import mongoose from 'mongoose';

const cashTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['in', 'out'], required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const posSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    openedAt: { type: Date, default: Date.now },
    closedAt: Date,
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    openingBalance: { type: Number, default: 0 },
    closingBalance: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    salesBreakdown: {
      cash: { type: Number, default: 0 },
      card: { type: Number, default: 0 },
      upi: { type: Number, default: 0 },
    },
    ordersCount: { type: Number, default: 0 },
    cashTransactions: [cashTransactionSchema],
  },
  { timestamps: true }
);

const POSSession = mongoose.model('POSSession', posSessionSchema);
export default POSSession;
