const mongoose = require("mongoose");

const paymentPreferenceSchema = new mongoose.Schema({
  referenceEvent: {
    type: String,
    enum: ["Checkin", "Checkout", "BookingDate", "MonthEndOfCheckout"],
    required: true
  },
  dayOffset: {
    type: Number,
    required: true
  },
  amountShare: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  description: {
    type: String,
    required: true
  },
  // New field to link to the user who created the preference
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This creates a reference to your User model
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PaymentPreference", paymentPreferenceSchema);