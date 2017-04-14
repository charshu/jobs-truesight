const mongoose = require('mongoose');
const { counter } = require('./Counter');


const Schema = mongoose.Schema;


const factorSchema = new Schema({
  name: String,
  value: Number,
  question_counter: Number

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
  if (!doc.id) {
    counter.findByIdAndUpdate({ _id: 'jobId' }, { $inc: { seq: 1 } }, (error, counter) => {
      if (error) { return next(error); }
      doc.id = counter.seq;
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
