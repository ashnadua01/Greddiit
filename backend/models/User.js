const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: "Hello, welcome to my new profile!"
  },
  age: {
    type: Number,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  saved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: false
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }],
});

module.exports = mongoose.model('User', UserSchema);
