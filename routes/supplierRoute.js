// routes/supplierRoute.js

const express = require('express');
const router = express.Router();

const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/suppliersController');




router.route('/')
  .post(createSupplier)   // POST /api/suppliers
  .get(getAllSuppliers);  // GET /api/suppliers

router.route('/:id')
  .get(getSupplierById)     // GET /api/suppliers/some_id
  .put(updateSupplier)      // PUT /api/suppliers/some_id
  .delete(deleteSupplier);  // DELETE /api/suppliers/some_id

module.exports = router;