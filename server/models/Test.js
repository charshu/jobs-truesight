const mongoose = require('mongoose');
const { counter } = require('./Counter');
const Schema = mongoose.Schema;


const choicePresetSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  choices: Array
}, { timestamps: true });

const choiceSchema = new Schema({
  title: String,
  value: Number
});

const questionSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  testId: Number,
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
  title: String
}, { timestamps: true });

const answerSheetSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  testUid: String,
  jobId: Number,
  workPlaceId: String

}, { timestamps: true });

testSheetSchema.pre('save', function (next) {
  const doc = this;
  counter.findByIdAndUpdate({ _id: 'testId' }, { $inc: { seq: 1 } }, (error, counter) => {
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


const TestSheet = mongoose.model('TestSheet', testSheetSchema);
const AnswerSheet = mongoose.model('AnswerSheet', answerSheetSchema);
const Question = mongoose.model('Question', questionSchema);
const ChoicePreset = mongoose.model('ChoicePreset', choicePresetSchema);
module.exports = { TestSheet, Question, ChoicePreset, AnswerSheet };
