const fs = require("fs");
const csv = require("csv-parser");
const CsvRecord = require("../models/CsvRecord");

// Fetch CSV records from database
const getUploadedData = async (req, res) => {
  try {
    const data = await CsvRecord.find(); // Fetch all records
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching uploaded CSV data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Upload and store CSV data
const handleCsvUpload = (req, res) => {
  const results = [];

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        if (results.length === 0) {
          return res.status(400).json({ message: "CSV is empty" });
        }

        await CsvRecord.insertMany(results); // ✅ Save to MongoDB

        return res.status(200).json({
          message: "CSV uploaded and saved successfully",
          data: results,
        });
      } catch (dbErr) {
        console.error("DB Save Error:", dbErr);
        return res.status(500).json({ message: "Failed to save to database" });
      }
    })
    .on("error", (err) => {
      console.error("CSV Parse Error:", err);
      return res.status(500).json({ message: "Error processing CSV" });
    });
};

module.exports = { handleCsvUpload, getUploadedData };
