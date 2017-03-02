// TODO: write mongoose schema for User
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    facebook: String,
    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    },
    createdAt: Date
});


userSchema.methods.createNewUser = (userDataJSON) => {
    // implement create new user

}
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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
