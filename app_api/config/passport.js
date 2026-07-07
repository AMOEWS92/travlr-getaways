// app_api/config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' }, // we log in using email
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).exec();
        if (!user) return done(null, false, { message: 'Incorrect email.' });
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);