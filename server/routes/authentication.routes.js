
module.exports = ({ User }) => {
  const passport = require('passport');
  const privateRouter = require('express').Router();
  const publicRouter = require('express').Router();

  const UserController = require('../controllers/user.controllers')({ User });

  // public authentication route
  publicRouter.post('/login', passport.authenticate('local'), UserController.login);
  publicRouter.post('/register', UserController.register);
  publicRouter.get('/facebook', passport.authenticate('facebook',{scope: ['email', 'public_profile'] }));
  publicRouter.get('/facebook/callback', passport.authenticate('facebook'),UserController.login);
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
  const router = require('express').Router();
  router.use(publicRouter);
  router.use(privateRouter);
  return router;
};
