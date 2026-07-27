const express = require('express');
const router = express.Router();

const ctrlTrips = require('../controllers/trips');

// Temporary debugging middleware.
// Displays the HTTP method, URL, and route parameters in the terminal.
router.use((req, res, next) => {
  console.log('Trips route request:', {
    method: req.method,
    url: req.originalUrl,
    params: req.params
  });

  next();
});

// GET /api/trips
// Return all trips.
router.get('/', ctrlTrips.tripsList);

// POST /api/trips
// Create a new trip.
router.post('/', ctrlTrips.tripsCreate);

// GET /api/trips/:tripCode
// Return one trip using its readable trip code.
router.get('/:tripCode', ctrlTrips.tripsReadOne);

// PUT /api/trips/:tripCode
// Update one trip using its readable trip code.
router.put('/:tripCode', ctrlTrips.tripsUpdateOne);

// DELETE /api/trips/:tripCode
// Delete one trip using its readable trip code.
router.delete('/:tripCode', ctrlTrips.tripsDeleteOne);

module.exports = router;