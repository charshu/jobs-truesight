// TODO: write mongoose schema for User
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { resultSchema } = require('./Job');

const Schema = mongoose.Schema;


const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: String,
  facebook: String,
  tokens: Array,
  profile: {
    name: String,
    gender: String,
    age_range: Number,
    location: String,
    jobId: { type: Number, ref: 'Job' },
    workPlaceId: String,
    picture: String,
    salary: Number
  },
  results: [resultSchema],
  answerSheetsId: [{ type: Number, ref: 'AnswerSheet' }]
}, { timestamps: true });


userSchema.methods.createNewUser = (userDataJSON) => {
    // implement create new user

};
/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
  if (!this.profile.picture) {
    this.profile.picture = this.gravatar(200);
  }
});
/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err)reject(err);
      else resolve(isMatch);
    });
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email)
  .digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
