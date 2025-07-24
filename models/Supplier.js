// models/Supplier.js

const mongoose = require('mongoose');

const SUPPLIER_TYPE_ENUM = ['Transporter Company', 'Single Driver'];
const CAB_TYPE_ENUM = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Tempo Traveller', 'Minibus'];

const contactSchema = new mongoose.Schema({
  contactName: { type: String, required: [true, 'Contact name is required.'], trim: true },
  contactPhone: { type: String, required: [true, 'Contact phone number is required.'], trim: true },
  contactEmail: { type: String, trim: true, lowercase: true, match: [/.+\@.+\..+/, 'Please fill a valid email address'] },
}, { _id: false });


// --- NEW: Sub-schema for a single cab ---
// This defines the structure for each cab a supplier can have.
const cabSchema = new mongoose.Schema({
  cabName: {
    type: String,
    required: [true, 'Cab name is required.'],
    trim: true,
  },
  cabType: {
    type: String,
    enum: { values: CAB_TYPE_ENUM, message: '"{VALUE}" is not a supported cab type.' },
    required: true,
  },
  numberOfSeater: {
    type: Number,
    min: [1, 'Number of seats must be at least 1.'],
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Price for the cab is required.'],
    min: [0, 'Price cannot be negative.'],
  },
}, { _id: false });
// ------------------------------------------


// The main supplier schema
const supplierSchema = new mongoose.Schema({
  supplierType: {
    type: String,
    required: [true, 'Supplier type is required.'],
    enum: { values: SUPPLIER_TYPE_ENUM, message: '"{VALUE}" is not a supported supplier type.' },
  },
  companyName: {
    type: String,
    required: [true, 'Company or agent name is required.'],
    trim: true,
  },
  contacts: [contactSchema],

  // --- UPDATED: 'cabDetails' is now 'cabs' and is an array of cabSchema ---
  cabs: {
    type: [cabSchema],
    default: [], // Default to an empty array
  },
  // ----------------------------------------------------------------------

  tripDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

supplierSchema.index({ companyName: 1, supplierType: 1 });

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;