// TODO: write mongoose schema for User
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    createdAt: Date,
    age: Number,
    firstName: String,
    lastName: String,
});

userSchema.methods.createNewUser = (userDataJSON) => {
    // implement create new user
}

const User = mongoose.model('User', userSchema);

exports.schema = userSchema;
exports.model = User;