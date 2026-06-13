// Schema representing Menu Products
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  sku: { type: String, unique: true },
  stock: { type: Number, default: 0 },
  image: { type: String }, // URL to uploaded item image
  status: { type: String, enum: ['active', 'out_of_stock', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
