// routes/cityRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrGetCity,
  getAllCities,
  updateCity,
  deleteCity
} = require('../controllers/cityController');

// POST or Get city by name
router.post('/add', createOrGetCity);

// Get all cities
router.get('/list', getAllCities);

// Update city
router.put('/update/:id', updateCity);

// Delete city
router.delete('/delete/:id', deleteCity);

module.exports = router;
