const PaymentPreference = require("../models/paymentPreference");

const generateDescription = (amountShare, dayOffset, referenceEvent) => {
  if (amountShare === undefined || dayOffset === undefined || !referenceEvent) {
    return "Invalid preference data";
  }
  const daysAbs = Math.abs(dayOffset);
  const dayText = daysAbs === 1 ? "day" : "days";
  const beforeOrAfter = dayOffset < 0 ? "before" : "after";
  let eventText = "";
  switch (referenceEvent) {
    case 'Checkin': eventText = 'Checkin'; break;
    case 'Checkout': eventText = 'Checkout'; break;
    case 'BookingDate': eventText = 'Booking'; break;
    case 'MonthEndOfCheckout': eventText = 'Month End of Checkout'; break;
    default: eventText = referenceEvent;
  }
  if (dayOffset === 0) {
    return `${amountShare}% on ${eventText} Date`;
  }
  return `${amountShare}% ${daysAbs} ${dayText} ${beforeOrAfter} ${eventText}`;
};

exports.createPreference = async (req, res) => {
  try {
    const { referenceEvent, dayOffset, amountShare } = req.body;
    const description = generateDescription(amountShare, dayOffset, referenceEvent);

    const pref = new PaymentPreference({
      referenceEvent,
      dayOffset,
      amountShare,
      description,
      createdBy: req.user.id 
    });

    await pref.save();
    res.status(201).json({ message: "Preference created", data: pref });
  } catch (err) {
    res.status(500).json({ message: "Error creating preference", error: err.message });
  }
};

exports.getAllPreferences = async (req, res) => {
  try {
    const data = await PaymentPreference.find()
      .populate('createdBy', 'name') // <-- KEY CHANGE
      .sort({ createdAt: -1 });
      
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching preferences", error: err.message });
  }
};

exports.updatePreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { referenceEvent, dayOffset, amountShare } = req.body;
    const description = generateDescription(amountShare, dayOffset, referenceEvent);
    const updated = await PaymentPreference.findByIdAndUpdate(
      id,
      { referenceEvent, dayOffset, amountShare, description },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Preference not found" });
    }
    res.status(200).json({ message: "Preference updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating preference", error: err.message });
  }
};

exports.deletePreference = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PaymentPreference.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Preference not found" });
    }
    res.status(200).json({ message: "Preference deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting preference", error: err.message });
  }
};