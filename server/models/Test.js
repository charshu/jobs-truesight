const mongoose = require('mongoose');
const { counter } = require('./Counter');

const Schema = mongoose.Schema;


const choiceSchema = new Schema({
  title: String,
  value: Number
});

const questionSchema = new Schema({
  title: String,
  factorName: String,
  choices: [choiceSchema]

}, { timestamps: true });

const rangeSchema = new Schema({
  min: Number,
  result: String
});
const criteriaSchema = new Schema({
  factorName: String,
  ranges: [rangeSchema]
});

const testSheetSchema = new Schema({
  uid: {
    type: String,
    unique: true
  },
  doneCounter: 0,
  picture: String,
  criterias: [criteriaSchema],
  questions: [questionSchema],
  title: String
}, { timestamps: true });

const answerSchema = new Schema({
  questionId: String,
  selectedChoiceId: String
}, { timestamps: true });

const answerSheetSchema = new Schema({
  _id: {
    type: Number,
    unique: true
  },
  testSheetUid: { type: String, ref: 'TestSheet' },
  gender: String,
  age_range: Number,
  jobId: { type: Number, ref: 'Job' },
  workPlaceId: { type: String, ref: 'WorkPlace' },
  salary: Number,
  done: Boolean,
  answers: [answerSchema]

}, { timestamps: true });

const TestSheet = mongoose.model('TestSheet', testSheetSchema);
// testSheetSchema.pre('save', async (next) => {
//   const doc = this;
//   const found = await TestSheet.findOne({ uid: doc.uid });
//   if (found) { throw new Error('duplicate uid'); }
//   next();
// });


answerSheetSchema.pre('save', function (next) {
  const doc = this;
  if (!doc._id) {
    counter.findByIdAndUpdate({ _id: 'answerSheetId' }, { $inc: { seq: 1 } }, (error, counter) => {
      if (error) { return next(error); }
      console.log('gen id to answersheet');
      doc._id = counter.seq;
      next();
    });
  } else {
    next();
  }
});

const AnswerSheet = mongoose.model('AnswerSheet', answerSheetSchema);
const Question = mongoose.model('Question', questionSchema);
const Choice = mongoose.model('Choice', choiceSchema);
module.exports = { TestSheet, Question, Choice, AnswerSheet };
