const mongoose = require("mongoose");

const paymentPreferenceSchema = new mongoose.Schema({
  referenceEvent: {
    type: String,
    enum: ["Checkin", "Checkout", "BookingDate"],
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PaymentPreference", paymentPreferenceSchema);
