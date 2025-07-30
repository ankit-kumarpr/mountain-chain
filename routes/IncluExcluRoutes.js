// routes/IncluExcluRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPreset,
  getAllPresets,
  getPresetById,
  updatePreset,
  deletePreset
} = require('../controllers/presetController');

// All routes here will be prefixed with /api/enex (as defined in app.js)

// Route to create a new preset and get all presets
router.route('/presets')
  .post(createPreset)
  .get(getAllPresets);

// Route to get, update, and delete a specific preset by its ID
router.route('/presets/:id')
  .get(getPresetById)
  .put(updatePreset)
  .delete(deletePreset);

module.exports = router;