// @flow

module.exports = (arrayOfRoute) => {
  const routes = require('express').Router();
  arrayOfRoute.forEach(route => routes.use(route));
  return routes;
};
