const TermsAndConditions = require("../models/termsAndConditions");

exports.createTerms = async (req, res) => {
  try {
    const { name, termsAndConditionsText } = req.body;

    const existingTerms = await TermsAndConditions.findOne({ name });
    if (existingTerms) {
      return res.status(400).json({ message: `Terms & Conditions for '${name}' already exist.` });
    }

    const newTerms = await TermsAndConditions.create({
      name,
      termsAndConditionsText,
      createdBy: req.user.id, // Comes from the 'protect' middleware
    });

    res.status(201).json({ message: "Terms & Conditions created successfully", data: newTerms });
  } catch (err) {
    res.status(500).json({ message: "Error creating Terms & Conditions", error: err.message });
  }
};

exports.getAllTerms = async (req, res) => {
  try {
    const allTerms = await TermsAndConditions.find()
      .populate("createdBy", "name email") // Populate with user's name and email
      .sort({ updatedAt: -1 });

    res.status(200).json(allTerms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching Terms & Conditions", error: err.message });
  }
};


exports.getTermsById = async (req, res) => {
  try {
    const terms = await TermsAndConditions.findById(req.params.id).populate("createdBy", "name");
    
    if (!terms) {
      return res.status(404).json({ message: "Terms & Conditions not found" });
    }

    res.status(200).json(terms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching Terms & Conditions", error: err.message });
  }
};


exports.updateTerms = async (req, res) => {
  try {
    const { name, termsAndConditionsText } = req.body;

    const updatedTerms = await TermsAndConditions.findByIdAndUpdate(
      req.params.id,
      { name, termsAndConditionsText },
      { new: true, runValidators: true } // 'new: true' returns the updated doc, 'runValidators' ensures model rules are checked
    );

    if (!updatedTerms) {
      return res.status(404).json({ message: "Terms & Conditions not found" });
    }

    res.status(200).json({ message: "Terms & Conditions updated successfully", data: updatedTerms });
  } catch (err) {
    res.status(500).json({ message: "Error updating Terms & Conditions", error: err.message });
  }
};

exports.deleteTerms = async (req, res) => {
  try {
    const deletedTerms = await TermsAndConditions.findByIdAndDelete(req.params.id);

    if (!deletedTerms) {
      return res.status(404).json({ message: "Terms & Conditions not found" });
    }

    res.status(200).json({ message: "Terms & Conditions deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting Terms & Conditions", error: err.message });
  }
};