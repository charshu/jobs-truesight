// implement passport authentication strategy here
const _ = require('lodash');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


const User = require('../models/User');


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
  clientID: '1744234895905318',
  clientSecret: '337508e13131ff63bcaaba43052c5722',
  callbackURL: '/auth/facebook/callback',
  profileFields: [
    'name', 'email', 'link', 'locale', 'timezone'
  ],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    const user = new User();
          user.email = profile._json.email;
          user.facebook = profile.id;
          user
            .tokens
            .push({kind: 'facebook', accessToken});
          user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.gender = profile._json.gender;
          user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.profile.location = (profile._json.location)
            ? profile._json.location.name
            : '';
          user.save((err) => {
            done(err, user);
          });
}));


/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  //res.redirect('/login');
  res.send('not pass!');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req
    .path
    .split('/')
    .slice(-1)[0];

  if (_.find(req.user.tokens, {kind: provider})) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};