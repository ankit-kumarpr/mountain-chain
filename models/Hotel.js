const mongoose = require('mongoose');

const MEALS_ENUM = ['AP', 'BB', 'CP', 'EP','FB','HB','MAP','RO'];
const ROOM_TYPES_ENUM =  [
  "AC Deluxe Tent",
  "camp",
  "Club Class",
  "Club Deluxe",
  "Club Executive",
  "Club House ( 4 Person )",
  "Club Room",
  "Cottage",
  "Cottage Room",
  "Courtyard Executive Room",
  "Courtyard Family Suite",
  "Courtyard Premium Suite",
  "Deluxe",
  "Deluxe ( Non Balcony )",
  "Deluxe ( NON VIEW)",
  "Deluxe (NON VIEW)",
  "Deluxe double room",
  "Deluxe Non View",
  "Deluxe Room",
  "Deluxe Room ( Balcony room )",
  "Deluxe Room ( Non Valley Facing )",
  "Deluxe Room ( Non View )",
  "Deluxe Room AC",
  "Deluxe Room Non AC",
  "Deluxe Room( Mountain View)",
  "Deluxe Rooms",
  "Deluxe Tent",
  "Deluxe With Balcony",
  "Deluxr Room",
  "Double Deluxe Room"
];
const PAYMENT_ENUM = [
  "100% 1 day before Checkout",
  "100% 15 days after Month End of Checkout",
  "100% 7 days after Checkout",
  "100% 7 days after Month End of Checkout",
  "100% 7 days before Checkin",
  "100% on Booking",
  "25% on Booking, 75% 2 days before Checkin",
  "40% on Booking, 60% 7 days before Checkin",
  "50% on Booking, 50% 15 days before Checkin",
  "50% on Booking, 50% 30 days before Checkin"
];

const roomSchema = new mongoose.Schema({
  roomTypes: [{
    type: String,
    enum: ROOM_TYPES_ENUM
  }],
  allowedExtraBeds: Number,
  AWEB: Number,
  BasePrice: Number,
  CWEB: Number,
  CWoEB: Number,
personPerRoom: Number,
  numberOfRooms: Number
}, { _id: false });

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  groupName: String,
  stars: Number,

  location: String,

  // Address fields
  state: String,
  city: String,
  county: String,
  zipcode: String,
  streetAddress: String,
  locality: String,
  landmark: String,

  phoneNumbers: [String],
  emails: [String],

  meals: [{
    type: String,
    enum: MEALS_ENUM
  }],

  rooms: [roomSchema],

  checkinTime: String,
  checkoutTime: String,
  
  childrenAgeRangeMin: Number,
  childrenAgeRangeMax: Number,

  // Dynamics destination references
  tripDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],

  paymentPreference: {
    type: String,
    enum: PAYMENT_ENUM
  },

  hotelImagesLink: String
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);


// Hotel.js