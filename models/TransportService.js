// models/TransportService.js
const mongoose = require('mongoose');

const transportServiceSchema = new mongoose.Schema({
  fromCity: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  toCity: {
    type: String,
    lowercase: true,
    trim: true,
    default: null
  },
  shortCode: {
    type: String,
    trim: true
  },
  tripDestinations: [{
    type: String,
    trim: true
  }],
  serviceName: {
    type: String,
    required: true
  },
  serviceCode: {
    type: String,
    trim: true
  },
  distanceKm: {
    type: Number,
    default: 0
  },
  startTime: {
    type: String, // e.g., '08:00 AM'
    trim: true
  },
  durationMinutes: {
    type: Number,
    default: 60
  },
  itinerary: {
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('TransportService', transportServiceSchema);
