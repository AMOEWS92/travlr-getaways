// travlr/app_api/models/user.js
const mongoose = require('mongoose');
const crypto = require('crypto');          // Node's built-in crypto (not the npm pkg)
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:  { type: String, required: true, trim: true },
  hash:  { type: String, required: true },
  salt:  { type: String, required: true }
});

// Create salt + hash for a password
userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Validate a password against stored hash
userSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

// Generate a signed JWT (expires in 1 hour)
userSchema.methods.generateJWT = function() {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const User = mongoose.model('users', userSchema);
module.exports = User;