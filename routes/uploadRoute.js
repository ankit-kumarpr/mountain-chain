const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  handleCsvUpload,
  getUploadedData,
} = require("../controllers/uploadController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".csv") return cb(new Error("Only CSV files allowed"), false);
    cb(null, true);
  },
});

router.post("/", upload.single("file"), handleCsvUpload);
router.get("/data", getUploadedData); // <-- New route

module.exports = router;
