const Trip = require('../models/trip');

// Return all trips for the customer-facing travel list.
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find()
      .select('code name length start resort perPerson image description')
      .lean();

    return res.status(200).json(trips);
  } catch (err) {
    console.error('tripsList error:', err);

    return res.status(500).json({
      message: 'Unable to retrieve trips'
    });
  }
};

// Create a new trip. This route is protected by JWT middleware in routes/index.js.
const tripsCreate = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);

    return res.status(201).json(trip);
  } catch (err) {
    console.error('tripsCreate error:', err);

    return res.status(400).json({
      message: 'Validation error',
      error: err.message || err
    });
  }
};

// Return one trip using its readable trip code, such as GALE202401.
const tripsReadOne = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      code: req.params.tripid
    }).lean();

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    return res.status(200).json(trip);
  } catch (err) {
    console.error('tripsReadOne error:', err);

    return res.status(500).json({
      message: 'Unable to retrieve trip',
      error: err.message || err
    });
  }
};

// Update one trip using its readable trip code.
const tripsUpdateOne = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      {
        code: req.params.tripid
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    return res.status(200).json(trip);
  } catch (err) {
    console.error('tripsUpdateOne error:', err);

    return res.status(400).json({
      message: 'Validation error',
      error: err.message || err
    });
  }
};

// Delete one trip using its readable trip code.
const tripsDeleteOne = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      code: req.params.tripid
    });

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    return res.status(204).end();
  } catch (err) {
    console.error('tripsDeleteOne error:', err);

    return res.status(500).json({
      message: 'Unable to delete trip',
      error: err.message || err
    });
  }
};

module.exports = {
  tripsList,
  tripsCreate,
  tripsReadOne,
  tripsUpdateOne,
  tripsDeleteOne
};