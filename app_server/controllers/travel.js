// app_server/controllers/travel.js
const axios = require('axios');

// Base URL for your API
const apiBase = process.env.API_BASE || 'http://localhost:3000/api';

// GET /travel -> list all trips
const listTrips = async (req, res) => {
  try {
    const { data: trips } = await axios.get(`${apiBase}/trips`);
    res.render('travel', { title: 'Travel', trips });
  } catch (err) {
    console.error('listTrips error:', err.message);
    res.status(500).render('error', { message: 'Unable to load trips.' });
  }
};

// GET /travel/:tripid -> show one trip detail
const tripDetail = async (req, res) => {
  try {
    const { tripid } = req.params; // must match how your route is defined
    const { data: trip } = await axios.get(`${apiBase}/trips/${tripid}`);
    res.render('trip', { title: trip.name, trip });
  } catch (err) {
    const status = err.response?.status || 500;
    if (status === 404) {
      return res.status(404).render('404', { message: 'Trip not found.' });
    }
    console.error('tripDetail error:', err.message);
    res.status(500).render('error', { message: 'Unable to load trip.' });
  }
};

module.exports = { listTrips, tripDetail };