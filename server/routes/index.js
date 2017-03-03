const authenticationRoutes = require('./authentication.routes');

const routes = require('express').Router();

module.exports = function initRoute() {
  routes.use('/auth', authenticationRoutes());
  return routes;
};
