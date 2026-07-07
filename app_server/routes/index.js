const express = require('express');
const router = express.Router();

const travelController = require('../controllers/travel');

// Redirect the homepage to the available travel listings.
router.get('/', (req, res) => {
  res.redirect('/travel');
});

// Display all available trips.
router.get('/travel', travelController.listTrips);

// Display one selected trip using its readable trip code.
router.get('/travel/:tripid', travelController.tripDetail);

module.exports = router;