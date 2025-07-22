const mongoose = require("mongoose");

const CsvRecordSchema = new mongoose.Schema({}, { strict: false }); // Accepts any CSV structure

module.exports = mongoose.model("CsvRecord", CsvRecordSchema);
