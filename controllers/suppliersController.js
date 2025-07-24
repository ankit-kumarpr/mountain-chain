// controllers/suppliersController.js

const Supplier = require('../models/Supplier');

/**
 * @desc    Create a new supplier
 * @route   POST /api/suppliers
 * @access  Private
 */
const createSupplier = async (req, res) => {
  try {
    // Destructure the expected fields from the request body
    const {
      supplierType,
      companyName,
      contactName,
      contactPhone,
      contactEmail,
      cabName,
      cabType,
      numberOfSeater,
      tripDestinations 
    } = req.body;

    // --- Data Validation ---
    if (!supplierType || !companyName || !contactName || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: supplierType, companyName, contactName, and contactPhone are required.',
      });
    }

    // --- Structure the data to match the model ---
    // The model expects contacts to be an array of objects
    const supplierData = {
      supplierType,
      companyName,
      contacts: [{
        contactName,
        contactPhone,
        contactEmail, // This is optional
      }],
      cabDetails: {
        cabName,
        cabType,
        numberOfSeater,
         tripDestinations,
      },
      // createdBy: req.user.id, // Example if you have user authentication
    };

    // Create a new supplier instance and save it to the database
    const newSupplier = new Supplier(supplierData);
    await newSupplier.save();

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully.',
      data: newSupplier,
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Private
 */
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({}) .populate('tripDestinations', 'name').sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get a single supplier by ID
 * @route   GET /api/suppliers/:id
 * @access  Private
 */
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id) .populate('tripDestinations');
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    console.error('Error fetching supplier by ID:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Update a supplier by ID
 * @route   PUT /api/suppliers/:id
 * @access  Private
 */
const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // new: true returns the updated document
        );

        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.status(200).json({ success: true, message: 'Supplier updated successfully', data: supplier });
    } catch (error) {
        console.error('Error updating supplier:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

/**
 * @desc    Delete a supplier by ID
 * @route   DELETE /api/suppliers/:id
 * @access  Private
 */
const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};