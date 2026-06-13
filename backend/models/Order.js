const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true }, // snapshot at time of order
    price: { type: Number, required: true }, // unit price snapshot
    quantity: { type: Number, required: true, min: 1 },
    tax: { type: Number, default: 0 }, // tax % snapshot
    discount: { type: Number, default: 0 }, // amount discounted on this line (from product promotions)
    lineTotal: { type: Number, required: true }, // (price * quantity) - discount
    kdsStatus: {
      type: String,
      enum: ['pending', 'to_cook', 'preparing', 'completed'],
      default: 'pending',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      default: null,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    items: [orderItemSchema],
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },
    appliedPromotions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
      },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'paid', 'cancelled'],
      default: 'draft',
    },
    kitchenStatus: {
      type: String,
      enum: ['not_sent', 'to_cook', 'preparing', 'completed'],
      default: 'not_sent',
    },
    payment: {
      method: {
        type: String,
        enum: ['cash', 'card', 'upi', null],
        default: null,
      },
      amountReceived: { type: Number, default: 0 }, // for cash
      changeDue: { type: Number, default: 0 }, // for cash
      transactionRef: { type: String, default: '' }, // for card
      upiTxnId: { type: String, default: '' }, // for upi
      paidAt: { type: Date, default: null },
    },
    receiptSentTo: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 'text' });

module.exports = mongoose.model('Order', orderSchema);
