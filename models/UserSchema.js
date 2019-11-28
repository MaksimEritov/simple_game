/**
 * User schema for mongoouse
 * 
 * @use crypto for crypt password
 * @use jwt to generate token
 * 
 * @exports Chat model
 */

const mongoose = require("mongoose");
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const secret = require('../config/secret').secret



Schema = mongoose.Schema;

let schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
}, {timestamps: true});


/**
 * Generate password method 
 * 
 * @param password|string
 * @return void
 */
schema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

/**
 * Password validation method
 * 
 * @param password|string
 * @return void
 */
schema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hashedPassword === hash;
}

/**
 * Generate token
 * 
 * @return void
 */
schema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60)
  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime()/1000)
  }, secret)
}

/**
 * Generate data for sending to frontend
 * 
 * @return void
 */
schema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    token: this.generateJWT(),
  }
}


module.exports = mongoose.model('User', schema);
