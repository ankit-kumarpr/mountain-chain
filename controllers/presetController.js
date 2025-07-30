const Preset = require('../models/preset');

// Create a new preset
exports.createPreset = async (req, res) => {
 try {
 const {
 presetName,
 inclusions,
 exclusions
 } = req.body;
 // In a real application, you would get the logged-in user's name from the request object
 const createdBy = "Logged In User Name"; // Placeholder
 const newPreset = new Preset({
 presetName,
 inclusions,
 exclusions,
 createdBy
 });
 await newPreset.save();
 res.status(201).json({
 message: 'Preset created successfully!',
 preset: newPreset
 });
 } catch (error) {
 res.status(500).json({
 message: 'Error creating preset',
 error
 });
 }
};

// Get all presets
exports.getAllPresets = async (req, res) => {
 try {
 const presets = await Preset.find();
 res.status(200).json(presets);
 } catch (error) {
 res.status(500).json({
 message: 'Error fetching presets',
 error
 });
 }
};

// Get a single preset by ID
exports.getPresetById = async (req, res) => {
 try {
 const preset = await Preset.findById(req.params.id);
 if (!preset) {
 return res.status(404).json({
 message: 'Preset not found'
 });
 }
 res.status(200).json(preset);
 } catch (error) {
 res.status(500).json({
 message: 'Error fetching preset',
 error
 });
 }
};

// Update a preset by ID
exports.updatePreset = async (req, res) => {
 try {
 const {
 presetName,
 inclusions,
 exclusions
 } = req.body;
 const updatedPreset = await Preset.findByIdAndUpdate(req.params.id, {
 presetName,
 inclusions,
 exclusions
 }, {
 new: true
 });
 if (!updatedPreset) {
 return res.status(404).json({
 message: 'Preset not found'
 });
 }
 res.status(200).json({
 message: 'Preset updated successfully!',
 preset: updatedPreset
 });
 } catch (error) {
 res.status(500).json({
 message: 'Error updating preset',
 error
 });
 }
};

// Delete a preset by ID
exports.deletePreset = async (req, res) => {
 try {
 const deletedPreset = await Preset.findByIdAndDelete(req.params.id);
 if (!deletedPreset) {
 return res.status(404).json({
 message: 'Preset not found'
 });
 }
 res.status(200).json({
 message: 'Preset deleted successfully!'
 });
 } catch (error) {
 res.status(500).json({
 message: 'Error deleting preset',
 error
 });
 }
};