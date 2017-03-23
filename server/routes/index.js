const authenticationRoutes = require('./authentication.routes');
const testRoutes = require('./test.routes');
const routes = require('express').Router();

module.exports = function initRoute() {
  routes.use('/auth', authenticationRoutes());
  routes.use('/test', testRoutes());
  return routes;
};
