const mongoose = require('mongoose');
const { counter } = require('./Counter');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  name: String
}, { timestamps: true });

jobSchema.pre('save', function (next) {
  const doc = this;
  counter.findByIdAndUpdate({ _id: 'jobId' }, { $inc: { seq: 1 } }, (error, counter) => {
    if (error) { return next(error); }
    console.log(counter.seq);
    doc.id = counter.seq;
    next();
  });
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
