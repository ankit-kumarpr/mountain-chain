const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadCSV"); // CSV upload middleware

const {
  GelSingleHotel,
  DeleteAnyhotel,
  UpdateAnyHotel,
  GelallHotelList,
  CreateNewHotel,
  BulkUploadHotels
} = require("../controllers/hotelController");

router.post("/addhotel", CreateNewHotel);
router.post("/upload-hotels-csv", upload.single('file'), BulkUploadHotels); // new route
router.get("/gethotels", GelallHotelList);
router.get("/hotels/:id", GelSingleHotel);
router.put("/hotels/:id", UpdateAnyHotel);
router.delete("/hotels/:id", DeleteAnyhotel);

module.exports = router;
