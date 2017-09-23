let DB = require('../databases/db')
let passport = require('passport')
let Strategy = require('passport-local').Strategy

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'pwd'
  },
  function (username, password, cb) {
    DB.user.find('username', username, function (err, user) {
      if (err) { return cb(err) }
      if (!user) { return cb(null, false) }
      if (user.pwd !== password) { return cb(null, false) }
      return cb(null, user)
    })
  }))
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user.uid)
})

passport.deserializeUser(function (uid, cb) {
  DB.user.find('uid', uid, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

module.exports = passport