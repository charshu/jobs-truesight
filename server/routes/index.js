// TODO: implement express router
// add passport as middleware

const express = require('express');
const routes = express.Router();
const graph = require('fbgraph');
const passport = require('passport');
const passportConfig = require('./../middlewares/authentication');


/**
 * Controllers (route handlers).
 */
//const homeController = require('./controllers/home');
const userController = require('./../controllers/user');
const apiController = require('./../controllers/api');
// const contactController = require('./controllers/contact');


// TODO :setup public routes
// ex staticfiles, POST login
routes.get('/api/handshake', function(req, res) {
  res.send('Node server /api/handshake');
});
/**
 * Primary app routes.
 */
routes.get('/', (req, res)=>{
  res.send('hello world!');
});
routes.get('/login',passport.authenticate('local') ,userController.getLogin);
routes.post('/login', userController.postLogin);
routes.get('/logout', userController.logout);
routes.get('/forgot', userController.getForgot);
routes.post('/forgot', userController.postForgot);
routes.get('/reset/:token', userController.getReset);
routes.post('/reset/:token', userController.postReset);
routes.get('/signup', userController.getSignup);
routes.post('/signup', userController.postSignup);
// routes.get('/contact', contactController.getContact);
// routes.post('/contact', contactController.postContact);
routes.get('/account', passportConfig.isAuthenticated, userController.getAccount);
routes.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
routes.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
routes.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
routes.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

// TODO: setup private routes
// ex authentication
// user session
// any route that need to check session

routes.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
routes.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}));
routes.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}), (req, res) => {
  res.send('complete');
});

module.exports = routes;
