const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },

  isVerified: { type: Boolean, default: false },
  verificationToken: String
});

module.exports = mongoose.model('User', UserSchema);
