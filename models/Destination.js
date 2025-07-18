    const mongoose = require('mongoose');

    const destinationSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true 
        },

    shortName: {
        type: String, 
        required: true 
    },

    currency: {
        type: String, 
        default: 'INR'
    },

        createdBy: 
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },

    aliases: [{ type: String }]
    },
    

    { timestamps: true });

    module.exports = mongoose.model('Destination', destinationSchema);