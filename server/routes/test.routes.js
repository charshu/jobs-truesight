
module.exports = () => {
  const privateRouter = require('express').Router();
  const publicRouter = require('express').Router();

  const mergeRoutes = require('../helpers/mergeRoutes');
  const TestController = require('../controllers/test.controllers')();

  // public authentication route

  publicRouter.post('/', TestController.createTestSheet);

  // private route
  privateRouter.use((req, res, next) => {
      // reject if no user
    if (!req.user) {
      res.status(401).end();
    } else {
      next();
    }
  });
  privateRouter.post('/answer', TestController.createAnswerSheet);

  // merge route
  return mergeRoutes([publicRouter, privateRouter]);
};
