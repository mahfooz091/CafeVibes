const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Promotion name is required'],
      trim: true,
    },
    appliesTo: {
      type: String,
      enum: ['product', 'order'],
      required: true,
    },
    // Required when appliesTo === 'product'
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    minQuantity: {
      type: Number,
      default: null, // used when appliesTo === 'product'
      min: 1,
    },
    // Required when appliesTo === 'order'
    minOrderAmount: {
      type: Number,
      default: null, // used when appliesTo === 'order'
      min: 0,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Promotion', promotionSchema);
