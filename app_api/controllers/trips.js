const Trip = require('../models/trip');

// Return all trips.
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find()
      .select(
        'code name length start resort perPerson image description'
      )
      .lean();

    return res.status(200).json(trips);
  } catch (err) {
    console.error('tripsList error:', err);

    return res.status(500).json({
      message: 'Unable to retrieve trips'
    });
  }
};

// Create a new trip.
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

// Return one trip using its readable trip code.
const tripsReadOne = async (req, res) => {
  try {
    console.log('Trip parameters:', req.params);

    const trip = await Trip.findOne({
      code: req.params.tripCode
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
        code: req.params.tripCode
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
      code: req.params.tripCode
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

// Generate database-driven summary and grouped resort statistics.
const tripsReport = async (req, res) => {
  try {
    const overallSummary = await Trip.aggregate([
      {
        $addFields: {
          // Convert values such as "$1,299.00" into numbers.
          numericPrice: {
            $convert: {
              input: {
                $replaceAll: {
                  input: {
                    $replaceAll: {
                      input: '$perPerson',
                      find: {
                        $literal: '$'
                      },
                      replacement: ''
                    }
                  },
                  find: ',',
                  replacement: ''
                }
              },
              to: 'double',
              onError: null,
              onNull: null
            }
          },

          // Extract the first number from values such as
          // "4 nights / 5 days".
          numericDuration: {
            $convert: {
              input: {
                $arrayElemAt: [
                  {
                    $split: ['$length', ' ']
                  },
                  0
                ]
              },
              to: 'int',
              onError: null,
              onNull: null
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalTrips: {
            $sum: 1
          },
          averagePrice: {
            $avg: '$numericPrice'
          },
          averageDuration: {
            $avg: '$numericDuration'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalTrips: 1,
          averagePrice: {
            $round: [
              {
                $ifNull: ['$averagePrice', 0]
              },
              2
            ]
          },
          averageDuration: {
            $round: [
              {
                $ifNull: ['$averageDuration', 0]
              },
              2
            ]
          }
        }
      }
    ]);

    const tripsByResort = await Trip.aggregate([
      {
        $group: {
          _id: '$resort',
          tripCount: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          tripCount: -1,
          _id: 1
        }
      },
      {
        $project: {
          _id: 0,
          resort: '$_id',
          tripCount: 1
        }
      }
    ]);

    const summary = overallSummary[0] || {
      totalTrips: 0,
      averagePrice: 0,
      averageDuration: 0
    };

    return res.status(200).json({
      summary,
      tripsByResort
    });
  } catch (err) {
    console.error('tripsReport error:', err);

    return res.status(500).json({
      message: 'Unable to generate trip report',
      error: err.message || err
    });
  }
};

module.exports = {
  tripsList,
  tripsCreate,
  tripsReadOne,
  tripsUpdateOne,
  tripsDeleteOne,
  tripsReport
};