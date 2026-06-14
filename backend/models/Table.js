import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Table name is required'], trim: true },
    floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
    seatCount: { type: Number, required: true, min: 1, default: 4 },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'disabled'],
      default: 'available',
    },
    shape: {
      type: String,
      enum: ['round', 'square', 'rectangle'],
      default: 'square',
    },
    x: { type: Number, default: 100 },
    y: { type: Number, default: 100 },
    reservationTime: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Table = mongoose.model('Table', tableSchema);
export default Table;
