// controllers/cityController.js
const City = require('../models/City');

exports.createOrGetCity = async (req, res) => {
  const { name, state = null, country = null } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "City name is required" });
  }

  try {
    let city = await City.findOne({ name: name.toLowerCase() });

    if (city) {
      return res.status(200).json({ success: true, message: "City already exists", city });
    }

    city = await City.create({
      name: name.toLowerCase(),
      ...(state && { state }),
      ...(country && { country })
    });

    return res.status(201).json({ success: true, message: "City created", city });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all cities
exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    return res.status(200).json({ success: true, cities });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update city
exports.updateCity = async (req, res) => {
  const { id } = req.params;
  const { name, state, country } = req.body;

  try {
    const updatedCity = await City.findByIdAndUpdate(id, {
      name: name?.toLowerCase(),
      state,
      country
    }, { new: true });

    if (!updatedCity) {
      return res.status(404).json({ success: false, message: "City not found" });
    }

    return res.status(200).json({ success: true, message: "City updated", city: updatedCity });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete city
exports.deleteCity = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await City.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "City not found" });
    }
    return res.status(200).json({ success: true, message: "City deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
