import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  tax: { type: Number, default: 0 },
  unit: { type: String, default: 'piece' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  categoryColor: { type: String },
  kitchenStatus: {
    type: String,
    enum: ['to_cook', 'preparing', 'completed'],
    default: 'to_cook',
  },
  notes: String,
});

const paymentSchema = new mongoose.Schema({
  method: { type: String, enum: ['cash', 'card', 'upi'], required: true },
  amount: { type: Number, required: true },
  transactionRef: String,
  qrCode: String,
  changeGiven: { type: Number, default: 0 },
  paidAt: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    status: {
      type: String,
      enum: ['draft', 'paid', 'cancelled'],
      default: 'draft',
    },
    kitchenStatus: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountType: { type: String, enum: ['fixed', 'percentage', 'coupon', 'promotion'] },
    discountSource: String,
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' },
    posSession: { type: mongoose.Schema.Types.ObjectId, ref: 'POSSession' },
    total: { type: Number, default: 0 },
    payment: paymentSchema,
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paidAt: Date,
    cancelledAt: Date,
    cancelReason: String,
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `CV${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
