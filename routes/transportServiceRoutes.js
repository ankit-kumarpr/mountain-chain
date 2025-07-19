// routes/transportServiceRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTransportService,
  getAllTransportServices,
  getTransportServiceById,
  updateTransportService,
  deleteTransportService
} = require('../controllers/transportServiceController');

router.post('/create', createTransportService);
router.get('/list', getAllTransportServices);
router.get('/:id', getTransportServiceById);
router.put('/update/:id', updateTransportService);
router.delete('/delete/:id', deleteTransportService);

module.exports = router;
