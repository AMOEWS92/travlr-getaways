const express = require('express');
const router = express.Router();
const ctrlTrips = require('../controllers/trips');
const authController = require('../controllers/authentication');
const jwt = require('jsonwebtoken'); // enables JWT auth

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET || 'mysecret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Trip routes
router.get('/trips', ctrlTrips.tripsList);
router.post('/trips', authenticateJWT, ctrlTrips.tripsCreate);
router.get('/trips/:tripid', ctrlTrips.tripsReadOne);
router.put('/trips/:tripid', authenticateJWT, ctrlTrips.tripsUpdateOne);
router.delete('/trips/:tripid', authenticateJWT, ctrlTrips.tripsDeleteOne);

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;