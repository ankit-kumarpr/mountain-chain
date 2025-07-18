const mongoose=require('mongoose');

const TripSourceSchema=new mongoose.Schema({
     type: {
    type: String,
    enum: ['B2B', 'Direct'],
    default: 'B2B'
  },
  companyName: {
    type: String,
    required: true,
    minlength: 2
  },
  shortName: {
    type: String,
    required: true,
    minlength: 2
  },
  tripTags: String,

  // Contact details
  contactName: String,
  contactEmail: String,
  phoneNumbers: [String], // multiple numbers

  // Address
  city: String,
  state: String,
  country: String,
  pinCode: String,
  street: String,
  area: String,
  landmark: String,

  // Billing
  billingName: String,
  billingDetails: String
}, { timestamps: true });


module.exports=mongoose.model('TripSource',TripSourceSchema);
