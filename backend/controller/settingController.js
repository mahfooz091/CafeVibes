const Setting = require('../models/Setting');

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default settings if they don't exist
      settings = new Setting();
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};
