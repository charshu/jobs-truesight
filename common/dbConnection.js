// Connect to mongo server
const mongoose = require('mongoose');
const chalk = require('chalk');
require('dotenv').config();

module.exports = function init() {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGO_URI);
  mongoose.connection
  .on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });
};
