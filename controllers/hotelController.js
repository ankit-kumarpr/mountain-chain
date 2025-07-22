const Hotel = require('../models/Hotel');
const csv = require('csvtojson');
const path = require('path');
const fs = require('fs');

// Register new hotel (single)
const CreateNewHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json({
      success: true,
      message: 'Hotel has been created',
      hotel
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Bulk upload hotels via CSV
const BulkUploadHotels = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "CSV file is required" });
    }

    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const jsonArray = await csv().fromFile(filePath);

    // Optional: transform array fields like phoneNumbers, meals, emails if needed
    const cleanedHotels = jsonArray.map(hotel => ({
      ...hotel,
      phoneNumbers: hotel.phoneNumbers ? hotel.phoneNumbers.split(',') : [],
      emails: hotel.emails ? hotel.emails.split(',') : [],
      meals: hotel.meals ? hotel.meals.split(',') : [],
      rooms: hotel.rooms ? JSON.parse(hotel.rooms) : [], // for nested room JSON if applicable
    }));

    const result = await Hotel.insertMany(cleanedHotels);
    fs.unlinkSync(filePath); // cleanup

    res.status(201).json({
      success: true,
      message: `${result.length} hotels uploaded successfully`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error processing CSV upload",
      error: error.message
    });
  }
};

// Get all hotel list
const GelallHotelList = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('tripDestinations');
    if (!hotels || hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hotels found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel List",
      hotels
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update hotel
const UpdateAnyHotel = async (req, res) => {
  try {
    const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({
      success: true,
      message: 'Hotel updated',
      hotel: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Delete hotel
const DeleteAnyhotel = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Hotel deleted'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get single hotel
const GelSingleHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('tripDestinations');
    return res.status(200).json({
      success: true,
      message: "Hotel data",
      data: hotel
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  GelSingleHotel,
  DeleteAnyhotel,
  UpdateAnyHotel,
  GelallHotelList,
  CreateNewHotel,
  BulkUploadHotels
};
