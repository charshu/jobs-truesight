// TODO: connection to mongodb
const mongoose = require('mongoose');

const MONGODB_URI= 'mongodb://localhost:27017/test';
const MONGOLAB_URI= 'mongodb://localhost:27017/test';

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI || MONGOLAB_URI);
mongoose
  .connection
  .on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });

module.exports = function connect() {
  // connect to mongoDB
  const MONGO_URI = process.env.MONGOURI;
}