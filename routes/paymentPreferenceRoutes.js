const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentPreferenceController");

// Create
router.post("/", controller.createPreference);

// Read all
router.get("/", controller.getAllPreferences);

// Update one
router.put("/:id", controller.updatePreference);

// Delete one
router.delete("/:id", controller.deletePreference);

module.exports = router;
