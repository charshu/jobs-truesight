// TODO: implement express router
// add passport as middleware

const express = require('express');

const routes = express.Router();

// TODO :setup public routes
// ex staticfiles, POST login
routes.get('/api/handshake', function(req, res) {
  res.send('Node server /api/handshake');
});


// TODO: setup private routes
// ex authentication
// user session
// any route that need to check session

module.exports = routes;
