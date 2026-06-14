import Floor from '../models/Floor.js';
import Table from '../models/Table.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getFloors = asyncHandler(async (req, res) => {
  const floors = await Floor.find().sort({ name: 1 });
  res.json({ success: true, count: floors.length, data: floors });
});

export const createFloor = asyncHandler(async (req, res) => {
  const floor = await Floor.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: floor });
});

export const updateFloor = asyncHandler(async (req, res) => {
  const floor = await Floor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!floor) throw new ApiError(404, 'Floor not found');
  res.json({ success: true, data: floor });
});

export const deleteFloor = asyncHandler(async (req, res) => {
  const tables = await Table.countDocuments({ floor: req.params.id });
  if (tables > 0) throw new ApiError(400, 'Cannot delete floor with existing tables');
  const floor = await Floor.findByIdAndDelete(req.params.id);
  if (!floor) throw new ApiError(404, 'Floor not found');
  res.json({ success: true, message: 'Floor deleted' });
});

export const getTables = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.floor) filter.floor = req.query.floor;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const tables = await Table.find(filter)
    .populate('floor', 'name')
    .populate('currentOrder')
    .sort({ name: 1 });
  res.json({ success: true, count: tables.length, data: tables });
});

export const createTable = asyncHandler(async (req, res) => {
  const floor = await Floor.findById(req.body.floor);
  if (!floor) throw new ApiError(404, 'Floor not found');

  const table = await Table.create({ ...req.body, createdBy: req.user._id });
  await table.populate('floor', 'name');
  res.status(201).json({ success: true, data: table });
});

export const updateTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('floor', 'name');
  if (!table) throw new ApiError(404, 'Table not found');
  res.json({ success: true, data: table });
});

export const deleteTable = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id);
  if (!table) throw new ApiError(404, 'Table not found');
  if (table.status === 'occupied') throw new ApiError(400, 'Cannot delete occupied table');
  await table.deleteOne();
  res.json({ success: true, message: 'Table deleted' });
});
