var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
// ^^ capitalized because it is a constructor
var keys = require('./keys.js');
var app = express();

app.use(session({secret: 'A real secret'}));
// ^^ use session must come before you set passport.session
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: keys.facebookKey,
  clientSecret: keys.facebookSecret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'  // < must match the callback url you gave facebook
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

// start
app.get('/auth/facebook', passport.authenticate('facebook'));
// callback for facebook
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/me',
    failureRedirect: '/auth/facebook'
}));

// the next two items are because we are using passport-session
passport.serializeUser(function(user, done) {
    // go to mongo get _id for user, put that on session
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
    // get data off of session (see serializeUser)
  done(null, obj);
  // put it on req.user in EVERY ENDPOINT
});

app.get('/me', function(req, res, next) {
    res.send(req.user);
});

app.listen('3000', function() {
    console.log('server started on port 3000');
});
