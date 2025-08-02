const express = require('express');
const router = express.Router();
const { createQuotation, getQuotation, updateQuotation, deleteQuotation, generateQuotationPDF, attachQuotation,getQuotationsByQuery  } = require('../controllers/quotationController');
const { protect } = require('../middleware/authMiddleware'); // ✅ use correct name

// All routes are protected
router.use(protect);

router.get('/by-query/:queryId', getQuotationsByQuery);

// --- CRUD Operations ---
router.post('/', createQuotation);
router.get('/:id', getQuotation);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);

// --- Advanced Functionality ---
router.get('/:id/pdf', generateQuotationPDF);
router.post('/:id/attach', attachQuotation);

module.exports = router;
