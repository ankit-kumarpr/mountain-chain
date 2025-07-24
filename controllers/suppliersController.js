// controllers/suppliersController.js

const Supplier = require('../models/Supplier');

/**
 * @desc    Create a new supplier
 * @route   POST /api/suppliers
 * @access  Private
 */
const createSupplier = async (req, res) => {
  try {
    // Destructure all expected fields from the request body
    const {
      supplierType,
      companyName,
      contactName,
      contactPhone,
      contactEmail,
      cabName,
      cabType,
      numberOfSeater,
      tripDestinations // This is a top-level field
    } = req.body;

    // --- Data Validation ---
    if (!supplierType || !companyName || !contactName || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: supplierType, companyName, contactName, and contactPhone are required.',
      });
    }

    // --- Correctly Structure Data for Mongoose Model ---
    const supplierData = {
      supplierType,
      companyName,
      contacts: [{
        contactName,
        contactPhone,
        contactEmail,
      }],
      cabDetails: { // Nest cab-specific fields
        cabName,
        cabType,
        numberOfSeater,
      },
      tripDestinations, // This should be at the root level, not inside cabDetails
      // createdBy: req.user.id, // Example if you have user authentication
    };

    const newSupplier = new Supplier(supplierData);
    await newSupplier.save();

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully.',
      data: newSupplier,
    });

  } catch (error) {
    console.error('Error creating supplier:', error);
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
    // Populate tripDestinations to get names instead of just IDs
    const suppliers = await Supplier.find({}).populate('tripDestinations', 'name').sort({ createdAt: -1 });
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
    // Populate tripDestinations to get full objects for the edit form
    const supplier = await Supplier.findById(req.params.id).populate('tripDestinations');
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

        // --- RESTRUCTURE THE FLAT PAYLOAD FROM FRONTEND ---
        // Build an update object that matches the nested schema structure
        const updateData = {
            supplierType,
            companyName,
            // Use dot notation to update nested fields in arrays and objects
            'contacts.0.contactName': contactName,
            'contacts.0.contactPhone': contactPhone,
            'contacts.0.contactEmail': contactEmail,
            cabDetails: {
                cabName,
                cabType,
                numberOfSeater,
            },
            tripDestinations
        };
        // ---------------------------------------------------

        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, // Use the restructured updateData object with $set
            { new: true, runValidators: true, context: 'query' }
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