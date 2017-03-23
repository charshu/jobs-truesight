const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const counter = mongoose.model('Counter', CounterSchema);

module.exports = { counter };
