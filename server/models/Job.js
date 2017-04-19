const mongoose = require('mongoose');
const { counter } = require('./Counter');


const Schema = mongoose.Schema;


const factorSchema = new Schema({
  name: String,
  value: Number,
  question_counter: Number,
  max: Number,
  min: Number

});
const resultSchema = new Schema({
  testSheetUid: { type: String, ref: 'TestSheet' },
  jobId: { type: Number, ref: 'Job' },
  factors: [factorSchema]
}, { timestamps: true });

const jobSchema = new Schema({
  _id: {
    type: Number,
    unique: true
  },
  name: String,
  results: [resultSchema],
  answerSheetsId: [{ type: Number, ref: 'AnswerSheet' }]
}, { timestamps: true });

const workPlaceSchema = new Schema({
  _id: {
    type: String,
    unique: true
  },
  viewCount: Number,
  participant: {
    male: Number,
    female: Number,
    ages: [String]
  },
  factorsAvailable: [String],
  results: [resultSchema],
  answerSheetsId: [{ type: Number, ref: 'AnswerSheet' }]
}, { timestamps: true });


jobSchema.pre('save', function (next) {
  const doc = this;
  if (!doc._id) {
    counter.findByIdAndUpdate({ _id: 'jobId' }, { $inc: { seq: 1 } }, (error, counter) => {
      if (error) { return next(error); }
      doc._id = counter.seq;
      next();
    });
  } else {
    next();
  }
});


const Factor = mongoose.model('Factor', factorSchema);
const Result = mongoose.model('Result', resultSchema);
const Job = mongoose.model('Job', jobSchema);
const WorkPlace = mongoose.model('WorkPlace', workPlaceSchema);

module.exports = { Job, WorkPlace, Factor, Result, resultSchema };
