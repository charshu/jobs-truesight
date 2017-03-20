
module.exports = () => {
  const passport = require('passport');
  const privateRouter = require('express').Router();
  const publicRouter = require('express').Router();

  const mergeRoutes = require('../helpers/mergeRoutes');
  const UserController = require('../controllers/user.controllers')();

  // public authentication route
  publicRouter.post('/login', passport.authenticate('local'), UserController.login);
  publicRouter.post('/register', UserController.register);
  publicRouter.all('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'user_location'] }));
  publicRouter.all('/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'http://localhost:8080/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:8080/home');
  });

  // private route
  privateRouter.use((req, res, next) => {
      // reject if no user
    if (!req.user) {
      res.status(401).end();
    } else {
      next();
    }
  });
  privateRouter.get('/info', UserController.info);
  privateRouter.get('/logout', UserController.logout);
  privateRouter.delete('/', UserController.remove);


  // merge route
  return mergeRoutes([publicRouter, privateRouter]);
};
