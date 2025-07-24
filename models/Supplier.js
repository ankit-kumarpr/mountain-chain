// models/Supplier.js

const mongoose = require('mongoose');

// An enum to strictly control the supplier type
const SUPPLIER_TYPE_ENUM = ['Transporter Company', 'Single Driver'];

// An enum for different cab types
const CAB_TYPE_ENUM = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Tempo Traveller', 'Minibus'];

// A sub-schema for contact persons. A supplier can have multiple contacts.
const contactSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: [true, 'Contact name is required.'],
    trim: true,
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone number is required.'],
    trim: true,
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    // Optional: Add email validation
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
}, { _id: false }); // _id: false because this will be a subdocument

// The main supplier schema
const supplierSchema = new mongoose.Schema({
  // Section: Cab Supplier Type
  supplierType: {
    type: String,
    required: [true, 'Supplier type is required.'],
    enum: {
      values: SUPPLIER_TYPE_ENUM,
      message: '"{VALUE}" is not a supported supplier type.',
    },
  },

  // Section: Company Details
  companyName: {
    type: String,
    required: [true, 'Company or agent name is required.'],
    trim: true,
  },

  // Section: Contact Details
  // Storing contacts in an array allows for adding more later
  contacts: [contactSchema],

  // Section: Additional Cab Details
  cabDetails: {
    cabName: {
      type: String,
      trim: true,
      // This field might only be required for 'Single Driver' type
      // You can add custom validation for this in the controller if needed
    },
    cabType: {
      type: String,
      enum: {
        values: CAB_TYPE_ENUM,
        message: '"{VALUE}" is not a supported cab type.',
      },
    },
    numberOfSeater: {
      type: Number,
      min: [1, 'Number of seats must be at least 1.'],
    },
  },

  // --- NEW: Dynamic Trip Destinations Field ---
  tripDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination' // This 'ref' tells Mongoose which model to populate from
  }],
  // Optional: A field to link the supplier to a user account if needed
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    // required: true,
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// To improve query performance, create an index on frequently searched fields
supplierSchema.index({ companyName: 1, supplierType: 1 });


const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;