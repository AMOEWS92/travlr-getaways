const mongoose = require('mongoose');

// Define the structure of a travel document stored in MongoDB.
const tripSchema = new mongoose.Schema(
  {
    // Readable identifier used in URLs, such as GALE202401.
    code: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    // Display text such as "4 nights / 5 days".
    length: {
      type: String,
      required: true
    },

    start: {
      type: Date,
      required: true
    },

    resort: {
      type: String,
      required: true
    },

    // Display text such as "$999.00".
    perPerson: {
      type: String,
      required: true
    },

    // Filename for the trip image stored in public/images.
    image: {
      type: String
    },

    description: {
      type: String
    }
  },
  {
    collection: 'trips',
    timestamps: true
  }
);

// Export the model so the controller can call methods such as find().
module.exports = mongoose.model('Trip', tripSchema);