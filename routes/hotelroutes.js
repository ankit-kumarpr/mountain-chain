const express = require("express");
const router = express.Router();

const {
  GelSingleHotel,
  DeleteAnyhotel,
  UpdateAnyHotel,
  GelallHotelList,
  CreateNewHotel,
} = require("../controllers/hotelController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/hotels", CreateNewHotel);
router.get("/hotels", GelallHotelList);
router.get("/hotels/:id", GelSingleHotel);
router.put("/hotels/:id", UpdateAnyHotel);
router.delete("/hotels/:id", DeleteAnyhotel);

module.exports = router;


// hotelroutes.js