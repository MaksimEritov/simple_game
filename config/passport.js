/**
 * Passport Js config for user log in
 * 
 * @use passport-local mouse
 */

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');


const User = mongoose.model('User');

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
}, (username, password, done) => {
  User.findOne({ username: username })
    .then((user) => {
      if(!user || !user.validPassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, user);
    }).catch(done);
}));