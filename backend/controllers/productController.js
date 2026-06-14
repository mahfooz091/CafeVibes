import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, isActive } = req.query;
  const filter = {};

  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const products = await Product.find(filter)
    .populate('category', 'name color')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: products.length, data: products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name color');
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) throw new ApiError(404, 'Category not found');

  const product = await Product.create({ ...req.body, createdBy: req.user._id });
  await product.populate('category', 'name color');
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) throw new ApiError(404, 'Category not found');
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name color');

  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, message: 'Product deleted' });
});
