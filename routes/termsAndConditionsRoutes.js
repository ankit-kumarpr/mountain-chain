const express = require("express");
const router = express.Router();
const {
  createTerms,
  getAllTerms,
  getTermsById,
  updateTerms,
  deleteTerms,
} = require("../controllers/termsAndConditionsController");

const { protect } = require("../middleware/authMiddleware");


router.use(protect);

router.route("/")
  .post(createTerms)   
  .get(getAllTerms);   

router.route("/:id")
  .get(getTermsById)    
  .put(updateTerms)    
  .delete(deleteTerms); 

module.exports = router;