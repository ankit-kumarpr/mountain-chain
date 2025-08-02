const Quotation = require('../models/quotation.js');
const { createPdf } = require('../services/pdfService.js');

// Create a new Quotation
exports.createQuotation = async (req, res) => {
    try {
        const quoteId = `QT-${Date.now()}`;
        const newQuotation = new Quotation({
            ...req.body,
            quoteId: quoteId,
            createdBy: req.user.id
        });
        const savedQuotation = await newQuotation.save();
        res.status(201).json(savedQuotation);
    } catch (error) {
        console.error("Error in createQuotation:", error);
        res.status(500).json({ message: "Error creating quotation", error: error.message });
    }
};

// Get all Quotations for a specific Query
exports.getQuotationsByQuery = async (req, res) => {
    try {
        const { queryId } = req.params;
        if (!queryId) {
            return res.status(400).json({ message: "Query ID is required" });
        }
        const quotations = await Quotation.find({ queryId: queryId })
            .populate({
                path: 'queryId',
                select: 'guestName destination queryId childrenAges',
                populate: {
                    path: 'destination',
                    select: 'name'
                }
            })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(quotations);
    } catch (error) { // <-- BRACE WAS MISSING HERE
        console.error("Error in getQuotationsByQuery:", error);
        res.status(500).json({ message: "Error fetching quotations for query", error: error.message });
    }
};

// Get a single Quotation
exports.getQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findOne({ quoteId: req.params.id })
            .populate({
                path: 'queryId',
                populate: { path: 'destination' }
            })
            .populate('createdBy', 'name')
            .populate('hotelDetails.entries.hotelId', 'city state');

        if (!quotation) return res.status(404).json({ message: "Quotation not found" });
        res.status(200).json(quotation);
    } catch (error) {
        console.error("Error in getQuotation:", error);
        res.status(500).json({ message: "Error fetching quotation", error: error.message });
    }
};

// Update a Quotation
exports.updateQuotation = async (req, res) => {
    try {
        const updatedQuotation = await Quotation.findOneAndUpdate({ quoteId: req.params.id }, req.body, { new: true });
        if (!updatedQuotation) return res.status(404).json({ message: "Quotation not found" });
        res.status(200).json(updatedQuotation);
    } catch (error) {
        console.error("Error in updateQuotation:", error);
        res.status(500).json({ message: "Error updating quotation", error: error.message });
    }
};

// Delete a Quotation
exports.deleteQuotation = async (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
};

// Generate and send PDF
exports.generateQuotationPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quotation.findOne({ quoteId: id })
      .populate({
        path: 'queryId',
        populate: {
          path: 'destination',
          select: 'name'
        }
      })
      .populate({
        path: 'hotelDetails.entries.hotelId',
        select: 'city state'
      })
      .lean(); // use lean() to return plain JS object

    if (!quote) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const pdfBuffer = await createPdf(quote);

    console.log('PDF Buffer Length:', pdfBuffer.length);

    res.set({
      "Content-Type": "application/pdf",
      // Change to "inline" to allow preview in browser tab
      "Content-Disposition": `inline; filename="Quotation-${quote.quoteId}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer); // ✅ send raw buffer
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ message: "Failed to generate PDF", error: err.message });
  }
};




// Attach (copy) a quotation to a new query
exports.attachQuotation = async (req, res) => {
    try {
        const { newQueryId } = req.body;
        if (!newQueryId) return res.status(400).json({ message: "newQueryId is required" });

        const originalQuotation = await Quotation.findOne({ quoteId: req.params.id }).lean();
        if (!originalQuotation) return res.status(404).json({ message: "Original quotation not found" });

        const { _id, __v, createdAt, updatedAt, ...copyData } = originalQuotation;
        const newQuotation = new Quotation({
            ...copyData,
            queryId: newQueryId,
            status: 'Draft',
            quoteId: `QT-${Date.now()}`,
            createdBy: req.user.id
        });

        const savedCopy = await newQuotation.save();
        res.status(201).json({ message: "Quotation attached successfully", quotation: savedCopy });

    } catch (error) {
        console.error("Error in attachQuotation:", error);
        res.status(500).json({ message: "Error attaching quotation", error: error.message });
    }
};