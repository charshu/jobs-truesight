const mongoose = require('mongoose');
const { counter } = require('./Counter');
const { find } = require('lodash');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const factorSchema = new Schema({
  factor: String,
  value: Number

});
const resultSchema = new Schema({
  testSheetUid: String,
  factors: [factorSchema]

}, { timestamps: true });

const jobSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  name: String,
  results: [resultSchema],
  answers: [{ type: Number, ref: 'Answer' }]
}, { timestamps: true });

const workPlaceSchema = new Schema({
  placeId: {
    type: String,
    unique: true
  },
  results: [resultSchema],
  answers: [{ type: Number, ref: 'Answer' }]
}, { timestamps: true });


jobSchema.pre('save', function (next) {
  const doc = this;
  counter.findByIdAndUpdate({ _id: 'jobId' }, { $inc: { seq: 1 } }, (error, counter) => {
    if (error) { return next(error); }
    doc.id = counter.seq;
    next();
  });
});


const Factor = mongoose.model('Factor', factorSchema);
const Result = mongoose.model('Result', resultSchema);
const Job = mongoose.model('Job', jobSchema);
const WorkPlace = mongoose.model('WorkPlace', workPlaceSchema);

module.exports = { Job, WorkPlace, Factor, Result };
