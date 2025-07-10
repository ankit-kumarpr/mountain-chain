const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: String,
  role: {
    type: String,
    enum: [
      'Admin',
      'Sales Head',
      'Sales Person',
      'Operation Head',
      'Reservation',
      'Operation',
      'Accountant',
      'Data Operator',
      'Reservation Head'
    ],
    default: 'Sales Person'
  },
});

module.exports = mongoose.model('User', userSchema);
