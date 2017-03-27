const mongoose = require('mongoose');
const { counter } = require('./Counter');

const Schema = mongoose.Schema;


const choiceSchema = new Schema({
  title: String,
  value: Number
});

const questionSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  title: String,
  factor: String,
  choices: [choiceSchema]

}, { timestamps: true });

const testSheetSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  uid: {
    type: String,
    unique: true
  },
  questions: [questionSchema],
  title: String
}, { timestamps: true });

const answerSchema = new Schema({
  questionId: Number,
  selectedChoiceId: String
}, { timestamps: true });

const answerSheetSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  testSheetUid: String,
  userId: String,
  jobId: Number,
  workPlaceId: String,
  done: Boolean,
  answers: [answerSchema]

}, { timestamps: true });

testSheetSchema.pre('save', function (next) {
  const doc = this;
  counter.findByIdAndUpdate({ _id: 'testSheetId' }, { $inc: { seq: 1 } }, (error, counter) => {
    if (error) { return next(error); }
    console.log(counter.seq);
    doc.id = counter.seq;
    next();
  });
});
questionSchema.pre('save', function (next) {
  const doc = this;
  counter.findByIdAndUpdate({ _id: 'questionId' }, { $inc: { seq: 1 } }, (error, counter) => {
    if (error) { return next(error); }
    console.log(counter.seq);
    doc.id = counter.seq;
    next();
  });
});
answerSheetSchema.pre('save', function (next) {
  const doc = this;
  counter.findByIdAndUpdate({ _id: 'answerSheetId' }, { $inc: { seq: 1 } }, (error, counter) => {
    if (error) { return next(error); }
    console.log(counter.seq);
    doc.id = counter.seq;
    next();
  });
});


const TestSheet = mongoose.model('TestSheet', testSheetSchema);
const AnswerSheet = mongoose.model('AnswerSheet', answerSheetSchema);
const Question = mongoose.model('Question', questionSchema);
const Choice = mongoose.model('Choice', choiceSchema);
module.exports = { TestSheet, Question, Choice, AnswerSheet };
