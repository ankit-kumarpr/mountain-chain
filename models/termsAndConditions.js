const mongoose = require("mongoose");

const termsAndConditionsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name (Destination/Region) is required."],
    trim: true,
    unique: true, 
  },
  termsAndConditionsText: {
    type: String,
    required: [true, "Terms and Conditions text is required."],
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: { createdAt: false, updatedAt: true } 
});

module.exports = mongoose.model("TermsAndConditions", termsAndConditionsSchema);