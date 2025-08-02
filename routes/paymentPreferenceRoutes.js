const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentPreferenceController");
const { protect } = require("../middleware/authMiddleware"); // Import auth middleware

// Apply the 'protect' middleware to all routes in this file.
// A request must have a valid JWT to proceed.

// Create
router.post("/", protect, controller.createPreference);

// Read all
router.get("/", protect, controller.getAllPreferences);

// Update one
router.put("/:id", protect, controller.updatePreference);

// Delete one
router.delete("/:id", protect, controller.deletePreference);

module.exports = router;
