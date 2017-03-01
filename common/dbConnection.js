// Connect to mongo server
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = function init() {
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test2');
mongoose.connection
  .on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });
};