const Table = require('../models/Table');

exports.getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().populate('activeOrder');
    res.status(200).json(tables);
  } catch (error) {
    next(error);
  }
};

exports.updateTableStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, activeOrder } = req.body;

    const table = await Table.findByIdAndUpdate(
      id,
      { status, activeOrder },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json(table);
  } catch (error) {
    next(error);
  }
};
