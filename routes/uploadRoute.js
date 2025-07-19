const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { handleCsvUpload } = require("../controllers/uploadController");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".csv") {
      return cb(new Error("Only CSV files are allowed"), false);
    }
    cb(null, true);
  },
});

router.post("/", upload.single("file"), handleCsvUpload);

module.exports = router;
