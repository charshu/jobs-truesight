// TODO: implement express router
// add passport as middleware

const express = require('express');
const routes = express.Router();
const graph = require('fbgraph');
const passport = require('passport');
const passportConfig = require('./../middlewares/authentication');
// TODO :setup public routes
// ex staticfiles, POST login
routes.get('/api/handshake', function(req, res) {
  res.send('Node server /api/handshake');
});


// TODO: setup private routes
// ex authentication
// user session
// any route that need to check session

routes.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, getFacebook = (req, res, next) => {
  const token = req.user.tokens.find(token => token.kind === 'facebook');
  graph.setAccessToken(token.accessToken);
  graph.get(`${req.user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err, results) => {
    if (err) { return next(err); }
    res.json(results);
  });
});
routes.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}));
routes.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}), (req, res) => {
  res.send('complete');
});

module.exports = routes;
