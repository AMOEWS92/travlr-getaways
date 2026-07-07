// app_api/controllers/authentication.js
const passport = require('passport');
const User = require('../models/user');

// POST /api/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existing = await User.findOne({ email }).exec();
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const user = new User({ name, email, hash: '', salt: '' });
    user.setPassword(password);
    await user.save();

    const token = user.generateJWT();
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/login
const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err)   return res.status(404).json(err);
    if (!user) return res.status(401).json(info || { message: 'Unauthorized' });

    const token = user.generateJWT();
    return res.status(200).json({ token });
  })(req, res);
};

module.exports = { register, login };