const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

// Import function that connects this API to MongoDB
const { connect } = require('../config/db');

// Import all API route definitions, such as login and trip CRUD routes
const apiRoutes = require('./routes');

// Load environment variables from root .env file
// This keeps sensitive values like database connection strings and JWT secrets
// out of source code
require('dotenv').config({
  path: path.join(__dirname,'..','.env')
});

// Load Passport's local authentication strategy configuration
require('./config/passport');

const app = express();

// Log incoming HTTP requests in the terminal while developing
app.use(morgan('dev'));

// Allow the Angular admin app to communicate with this API
// The Authorization header is needed so JWT Bearer tokens can be sent
// with protected requests
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization'
    ],
    exposedHeaders:['Authorization']
  })
);

// Allow the API to read JSON data sent in request bodies
app.use(express.json());

// Start Passport so protected routes can authenticate users
app.use(passport.initialize());

// Print each API request in the terminal to help with debugging
app.use((req, res, next) => {
  console.log('[API hit] ${req.method} ${req.url}');
  next();
});

// Connect to MongoDB once when the API starts
connect()
.then(() => console.log('MongoDB connected (app_api)'))
.catch((err) => {
  console.error('MongoDB conenection error (app_api):', err);
  process.exit(1);
});

// Add all API routes to this application
// Since the root app mounts this API under /api, routes here become
// URLs such as /api/trips or /api/login
app.use('/', apiRoutes);

// Return JSON instead of an HTML page when an unknown API route is requested
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;