// routes/transportServiceRoutes.js
const express = require('express');
const upload = require ('../middleware/upload')
const router = express.Router();
const {
  createTransportService,
  getAllTransportServices,
  getTransportServiceById,
  updateTransportService,
  deleteTransportService,
  uploadTransportServicesCSV
} = require('../controllers/transportServiceController');

router.post('/create', createTransportService);
router.get('/list', getAllTransportServices);
router.get('/:id', getTransportServiceById);
router.put('/update/:id', updateTransportService);
router.delete('/delete/:id', deleteTransportService);
router.post('/upload-csv', upload.single('file'), uploadTransportServicesCSV);

module.exports = router;
