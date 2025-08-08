const Quotation = require('../models/quotation.js');
const { createPdf } = require('../services/pdfService.js');
const TripQuery = require('../models/TripQuery.js');
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

        // ✅ Update TripQuery status
        if (req.body.queryId) {
            await TripQuery.findByIdAndUpdate(
                req.body.queryId,
                { status: "In Progress" },
                { new: true }
            );
        }

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
    } catch (error) {
        console.error("Error in getQuotationsByQuery:", error);
        res.status(500).json({ message: "Error fetching quotations for query", error: error.message });
    }
};

// Get a single Quotation by its unique quoteId
exports.getQuotation = async (req, res) => {
    try {
       
        const quotation = await Quotation.findById(req.params.id)
            .populate({
                path: 'queryId',
                populate: { path: 'destination' }
            })
            .populate('createdBy', 'name')
            .populate('hotelDetails.entries.hotelId', 'city state');

        if (!quotation) {
            // This will now only trigger if the ID truly doesn't exist in the database
            return res.status(404).json({ message: "Quotation not found" });
        }
        
        res.status(200).json(quotation);

    } catch (error) {
        // This will catch errors like an invalid ID format
        console.error("Error in getQuotation:", error);
        res.status(500).json({ message: "Error fetching quotation", error: error.message });
    }
};

// ✅ COMPLETE AND CORRECTED updateQuotation function
exports.updateQuotation = async (req, res) => {
    try {
        const quoteToUpdate = await Quotation.findOne({ quoteId: req.params.id });

        if (!quoteToUpdate) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        const {
            flights,
            hotelDetails,
            transportDetails,
            dayWiseItinerary,
            inclusionsExclusions,
            termsAndConditions,
            summary,
        } = req.body;

        // --- Server-side recalculation to ensure data integrity ---
        const totalHotelCost = (hotelDetails?.entries?.reduce((acc, item) => {
            const nights = item.stayNights?.length || 1;
            return acc + (Number(item.sellingPrice) || 0) * nights;
        }, 0) || 0) +
        (hotelDetails?.specialInclusions?.reduce((acc, item) => acc + (Number(item.price) || 0), 0) || 0);

        const totalTransportCost = (transportDetails?.entries?.reduce((acc, entry) => {
            const numDays = entry.selectedDays?.length || 1;
            const entryTotal = entry.transportItems?.reduce((itemAcc, item) => itemAcc + (Number(item.givenPrice) || 0) * (item.qty || 1), 0) || 0;
            return acc + (entryTotal * numDays);
        }, 0) || 0) +
        (transportDetails?.extraServices?.reduce((acc, service) => acc + (Number(service.price) || 0), 0) || 0);

        const totalFlightCost = flights?.reduce((acc, flight) => acc + (Number(flight.givenPrice) || 0), 0) || 0;
        
        const serverCalculatedTotalSelling = totalHotelCost + totalTransportCost + totalFlightCost;

        // --- Update the document fields ---
        quoteToUpdate.flights = flights;
        quoteToUpdate.hotelDetails = hotelDetails;
        quoteToUpdate.transportDetails = transportDetails;
        quoteToUpdate.dayWiseItinerary = dayWiseItinerary;
        quoteToUpdate.inclusionsExclusions = inclusionsExclusions;
        quoteToUpdate.termsAndConditions = termsAndConditions;

        // Update summary, but overwrite total with the reliable server-calculated value
        if (summary) {
            quoteToUpdate.summary = summary;
            quoteToUpdate.summary.totalSellingPrice = serverCalculatedTotalSelling;
        }

        const updatedQuotation = await quoteToUpdate.save();

        res.status(200).json(updatedQuotation);

    } catch (error) {
        console.error("Error in updateQuotation:", error);
        res.status(500).json({ message: "Error updating quotation", error: error.message });
    }
};

// Delete a Quotation
exports.deleteQuotation = async (req, res) => {
    try {
        const deleted = await Quotation.findOneAndDelete({ quoteId: req.params.id });
        if (!deleted) return res.status(404).json({ message: "Quotation not found" });
        res.status(200).json({ message: "Quotation deleted successfully" });
    } catch (error) {
        console.error("Error deleting quotation:", error);
        res.status(500).json({ message: "Error deleting quotation", error: error.message });
    }
};


// Generate and send PDF
exports.generateQuotationPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await Quotation.findOne({ quoteId: id })
      .populate({ path: 'queryId', populate: { path: 'destination', select: 'name' } })
      .populate({ path: 'hotelDetails.entries.hotelId', select: 'city state' })
      .lean();

    if (!quote) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const pdfBuffer = await createPdf(quote);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Quotation-${quote.quoteId}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });
    return res.send(pdfBuffer);
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