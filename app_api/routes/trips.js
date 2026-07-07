// app_api/routes/trips.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trips');

// /api/trips
router.get('/', ctrl.list);

// /api/trips/:tripCode
router.get('/:tripCode', ctrl.readOne);

// /api/trips/:tripCode/image
router.get('/:tripCode/image', ctrl.getImage);

module.exports = router;