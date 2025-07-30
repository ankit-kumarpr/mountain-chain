// models/presetModel.js
const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  presetName: {
    type: String,
    required: [true, 'Preset name is required.'],
    trim: true,
    unique: true
  },
  inclusions: {
    type: [String],
    default: []
  },
  exclusions: {
    type: [String],
    default: []
  },
  createdBy: {
    type: String, // In a real app, this would be mongoose.Schema.Types.ObjectId and ref: 'User'
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Preset = mongoose.model('Preset', presetSchema);

module.exports = Preset;