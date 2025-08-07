const express = require('express');
const router = express.Router();
const { addDestinations,GetallDestination,updateDestination,
    CreateTripSourse,GetTripSource,UpdateTripSource,DeleteTripSource,
AddNewQuery,
GetalltripQuery,
UpdateQueryDataOrStatus,
AddfollowUp,
convertTripQuery,
GetAllfollowUps,
GetSingleQuery,
UpdateFolloqUpOfQuery
} = require('../controllers/destinationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/add-destinations',protect, authorizeRoles('Admin'), addDestinations);
router.get('/destinationlist',GetallDestination);
router.post('/update-destination/:id', protect, authorizeRoles('Admin'), updateDestination);


// trip source routes

router.post('/create-trip-sourse',protect, authorizeRoles('Admin'), CreateTripSourse);
router.get('/sourcelist',GetTripSource);
router.post('/update-source/:id',protect, authorizeRoles('Admin'), UpdateTripSource);
router.delete('/delsource/:id',protect, authorizeRoles('Admin'), DeleteTripSource);


// trip query routes
router.post('/addnewquery',protect, authorizeRoles('Admin'),AddNewQuery);
router.get('/getallquerys',GetalltripQuery);
router.post('/updatequery/:id',UpdateQueryDataOrStatus);
router.get("/getquery/:id", protect, GetSingleQuery);
router.post("/query/:queryId/convert", protect, convertTripQuery);

// follow ups routes
  
router.post('/addfollowups/:id',protect, authorizeRoles('Admin'),AddfollowUp)
router.get('/getfollowupsquery/:id', GetAllfollowUps);
router.post('/query/:queryId/followup/:index/status', UpdateFolloqUpOfQuery);


module.exports = router;