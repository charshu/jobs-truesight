// Connect to mongo server
const mongoose = require('mongoose');
module.exports = function init() {
mongoose.connection(process.env.MONGO_URI);
};