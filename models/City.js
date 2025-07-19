// models/City.js
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  state: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
