const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- NEW: Schema for Day-wise Itinerary ---
const DayWiseItinerarySchema = new Schema({
    day: { type: Number, required: true },
    date: { type: Date },
    title: { type: String, required: true },
    description: { type: String }
}, { _id: false }); // _id is not needed for sub-documents here

// --- NEW: Schema for Inclusions & Exclusions ---
const InclusionExclusionSchema = new Schema({
    category: { type: String, required: true },
    included: { type: String }, // Can store bullet points as a single string
    excluded: { type: String }  // Can store bullet points as a single string
}, { _id: false });

// Reusable schema for pricing (Unchanged)
const PriceSchema = {
    cost: { type: Number, default: 0 },
    selling: { type: Number, default: 0 }
};

// --- Other sub-schemas (Unchanged) ---
const FlightSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'Destination' },
    to: { type: Schema.Types.ObjectId, ref: 'Destination' },
    departureTime: Date,
    arrivalTime: Date,
    airline: String,
    flightClass: String,
    flightNumber: String,
    adults: Number,
    children: Number,
    infants: Number,
    costPrice: Number,
    givenPrice: Number,
    comments: String
});

const HotelInclusionSchema = new Schema({
    service: String,
    hotelName: String, // Store the name directly for display
    night: Number,
    price: Number,
    comments: String
});

const HotelEntrySchema = new Schema({
    stayNights: [Number],
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' },
    hotelName: String,
    roomConfig: String,
    mealPlan: String,
    numRooms: Number,
    paxPerRoom: Number,
    sellingPrice: Number,
});

const TransportItemSchema = new Schema({
    cabDetails: String,
    qty: Number,
    rate: Number,
    givenPrice: Number
});

const TransportDayEntrySchema = new Schema({
    selectedDays: [Number],
    serviceName: String,
    route: String,
    transportItems: [TransportItemSchema]
});

const TransportExtraServiceSchema = new Schema({
    service: String,
    price: Number,
    day: Number,
    comments: String
});


// --- Main Quotation Schema (Updated) ---
const QuotationSchema = new Schema({
    quoteId: { type: String, unique: true, required: true },
    queryId: { type: Schema.Types.ObjectId, ref: 'Query', required: true },
    status: { type: String, enum: ['Draft', 'Sent', 'Confirmed', 'Cancelled'], default: 'Draft' },

    // Denormalized query data for easy access
    startDate: Date,
    duration: String,
    pax: Number,

    // All quotation components
    flights: [FlightSchema],
    
    hotelDetails: {
        entries: [HotelEntrySchema],
        specialInclusions: [HotelInclusionSchema]
    },

    transportDetails: {
        entries: [TransportDayEntrySchema],
        extraServices: [TransportExtraServiceSchema]
    },

    dayWiseItinerary: [DayWiseItinerarySchema],
    inclusionsExclusions: [InclusionExclusionSchema],
    termsAndConditions: [String], // Array of strings for each term

    summary: {
        totalNetCost: Number,
        totalSellingPrice: Number,
        markup: { type: { type: String, enum: ['%', 'INR'] }, value: Number },
        gstPercentage: Number, // Renamed for clarity from `gst.value`
        finalPriceWithGst: Number, // Renamed for clarity from `finalPrice`
        internalRemarks: String,
        subtotalWithMarkup: Number,
        customerRemarks: String
    },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });


module.exports = mongoose.model('Quotation', QuotationSchema);