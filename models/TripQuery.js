const { default: mongoose } = require("mongoose");

const TripQuerySchema = new mongoose.Schema({
  queryId: {
    type: String,
    unique: true,
  },
  querySource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TripSource'
  },
salesTeam: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}],
  referenceId: String,
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  startDate: Date,
  numberOfNights: Number,
  duration: String,
  noOfAdults: Number,
  childrenAges: [Number],
  guestName: String,
  phoneNumbers: [String],
  email: String,
  address: String,
  comments: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
   status: {
    type: String,
    enum: ['New', 'In Progress', 'Converted', 'On Trip', 'Past Trips', 'Canceled', 'Dropped'],
    default: 'New'
  },
   followUps: [
  {
    message: String,
    dueDate: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completed: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Solved', 'Not Solved'],
      default: 'Not Solved'
    }
  }
]


}, { timestamps: true });


module.exports=mongoose.model('Query',TripQuerySchema);