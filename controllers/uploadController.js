const fs = require("fs");
const csv = require("csv-parser");

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
    .on("end", () => {
      return res.status(200).json({
        message: "File uploaded and parsed successfully",
        data: results,
      });
    })
    .on("error", (err) => {
      console.error(err);
      return res.status(500).json({ message: "Error processing CSV" });
    });
};

module.exports = { handleCsvUpload };
