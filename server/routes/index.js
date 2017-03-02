const authenticationRoutes = require('./authentication.routes');

const routes = require('express').Router();

module.exports = function initRoute(models) {
    routes.use('/auth', authenticationRoutes(models));
    return routes;
};
