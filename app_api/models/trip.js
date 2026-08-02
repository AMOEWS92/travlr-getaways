const mongoose = require('mongoose');

// Define structure of a travel document stored in MongoDB
const tripSchema = new mongoose.Schema(
  {
    // Readable indentifier used in URLs, such as GALE202401
    code: {
      type: String,
      required: [true, 'Trip code is required'],
      trim: true,
      minlength: [3, 'Trip code must contain at least 2 characters'],
      maxlength: [20, 'Trip code cannot exceed 20 characters']
    },

    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
      minlength: [2, 'Trip name must contain at least 2 characters'],
      maxlength: [100, 'Trip name cannot exceed 100 characters']
    },

    // Display text such as "4 nights / 5 days".
    length: {
      type: String,
      required: [true, 'Trip length is required'],
      trim: true,
      minlength: [2, 'Trip length must contain at least 2 characters'],
      maxlength: [50, 'Trip length cannot exceed 50 characters']
    },

    start: {
      type: Date,
      required: [true, 'Trip start date is required']
    },

    resort: {
      type: String,
      required: [true, 'Resort is required'],
      trim: true,
      minlength: [2, 'Resort must contain at least 2 characters'],
      maxlength: [100, 'Resort cannot exceed 100 characters']
    },

    // Display text such as "$999.00".
    perPerson: {
      type: String,
      required: [true, 'Price per person is required'],
      trim: true,
      validate: {
        validator(value) {
          const normalizedValue = String(value)
          .replace(/[$,]/g, '')
          .trim();

          const numericValue = Number(normalizedValue);

          return (
            normalizedValue.length > 0 &&
            !Number.isNaN(numericValue) &&
            numericValue >= 0
          );
        },
        message: 'Price per person must be a valid nonnegative value'
      }
    },

    // Filename for the trip image stored in public/images.
    image: {
      type: String,
      required: [true, 'Image filename is required'],
      trim: true,
      maxlength: [255, 'Image filename cannot exceed 255 characters']
    },

    description: {
      type: String,
      required: [true, 'Trip description is required'],
      trim: true,
      minlength: [
        10,
        'Trip description must contain at least 10 characters'
      ],
      maxlength: [
        2000,
        'Trip description cannot exceed 2,000 characters'
      ]
    }
  },
  {
    collection: 'trips',
    timestamps: true
  }
);

// Indexes support common lookups, filtering, and reporting queries.
tripSchema.index({ code: 1 }, { unique: true });
tripSchema.index({ name: 1 });
tripSchema.index({ resort: 1 });
tripSchema.index({ start: 1 });

// Export the model so the controlle can call methods such as find().
module.exports = mongoose.model('Trip', tripSchema);