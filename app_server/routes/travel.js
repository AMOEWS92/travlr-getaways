// app_server/routes/travel.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/travel');

// List page: /travel
router.get('/', ctrl.listTrips);

// Detail page: /travel/:tripCode  (e.g., /travel/GAL01)
router.get('/:tripCode', ctrl.tripDetail);

module.exports = router;