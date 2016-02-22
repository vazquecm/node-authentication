'use strict';


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_DIFFICULTY = 11;

const UserSchema = mongoose.Schema({
  email: String,
  hashedPassword: String
});

// hashing the password to enable more encryptability -- safeguards the password better providing increased security
UserSchema.pre('save', (next) => {
  bcrypt.hash(this.password, BCRYPT_DIFFICULTY, (err, hash) => {
    if (err) throw err;

    this.hashedPassword = hash;
    next();
  });
});

module.exports = mongoose.model('Users', UserSchema);

