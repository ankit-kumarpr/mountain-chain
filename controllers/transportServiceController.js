// controllers/transportServiceController.js
const TransportService = require('../models/TransportService');
const fs = require('fs');
const csv = require('csv-parser');



exports.uploadTransportServicesCSV = async (req, res) => {
  try {
    const services = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        // Validate and push each row
        services.push(row);
      })
      .on('end', async () => {
        try {
          const inserted = await TransportService.insertMany(services);
          fs.unlinkSync(req.file.path); // cleanup file
          return res.status(201).json({ success: true, message: 'Bulk transport services uploaded', data: inserted });
        } catch (dbErr) {
          console.error(dbErr);
          return res.status(500).json({ success: false, message: 'Failed to insert CSV data' });
        }
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'CSV upload failed' });
  }
};

// Create a new transport service
exports.createTransportService = async (req, res) => {
  try {
    const newService = await TransportService.create(req.body);
    return res.status(201).json({ success: true, message: "Transport service created", data: newService });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to create transport service" });
  }
};

// Get all transport services
exports.getAllTransportServices = async (req, res) => {
  try {
    const services = await TransportService.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: services });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching transport services" });
  }
};

// Get single transport service
exports.getTransportServiceById = async (req, res) => {
  try {
    const service = await TransportService.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, data: service });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching service" });
  }
};

// Update a transport service
exports.updateTransportService = async (req, res) => {
  try {
    const updated = await TransportService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service updated", data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update transport service" });
  }
};

// Delete a transport service
exports.deleteTransportService = async (req, res) => {
  try {
    const deleted = await TransportService.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete transport service" });
  }
};
