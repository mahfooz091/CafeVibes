import Customer from '../models/Customer.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCustomers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = search ? { $text: { $search: search } } : {};

  const customers = await Customer.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: customers.length, data: customers });
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, data: customer });
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: customer });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!customer) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, data: customer });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, message: 'Customer deleted' });
});
