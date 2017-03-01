// TODO: write mongoose schema for User
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
        location: String,
        website: String,
        picture: String
    },
    createdAt: Date
});

userSchema.methods.createNewUser = (userDataJSON) => {
    // implement create new user
    console.log(userDataJSON);
}

const User = mongoose.model('User', userSchema);

module.exports = User;