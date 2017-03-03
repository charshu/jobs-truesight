// turn off reassign rule for middleware
/* eslint no-param-reassign: "off" */

module.exports = (context = {}) => (req, res, next) => {
  req.context = context;
  next();
};

