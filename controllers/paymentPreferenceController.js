const PaymentPreference = require("../models/paymentPreference");

// CREATE new preference
exports.createPreference = async (req, res) => {
  try {
    const { referenceEvent, dayOffset, amountShare } = req.body;

    const pref = new PaymentPreference({
      referenceEvent,
      dayOffset,
      amountShare
    });

    await pref.save();
    res.status(201).json({ message: "Preference created", data: pref });
  } catch (err) {
    res.status(500).json({ message: "Error creating preference", error: err.message });
  }
};

// GET all preferences
exports.getAllPreferences = async (req, res) => {
  try {
    const data = await PaymentPreference.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching preferences", error: err.message });
  }
};

// UPDATE a preference by ID
exports.updatePreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { referenceEvent, dayOffset, amountShare } = req.body;

    const updated = await PaymentPreference.findByIdAndUpdate(
      id,
      { referenceEvent, dayOffset, amountShare },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Preference not found" });

    res.status(200).json({ message: "Preference updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating preference", error: err.message });
  }
};

// DELETE a preference by ID
exports.deletePreference = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PaymentPreference.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Preference not found" });

    res.status(200).json({ message: "Preference deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting preference", error: err.message });
  }
};
