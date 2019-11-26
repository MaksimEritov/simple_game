const crypto = require('crypto');
const mongoose = require('../libs/mongoose');

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
  created: {
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = async function(username,password, callback) {
  let User = this;
  let currentUser =   await User.findOne({username: username})
  if (currentUser) {
      if (currentUser.checkPassword(password)) {
          callback(null,user)
      } else {
          return callback(createError(403, 'Wrong password'))                  
      }
  } else {
      console.log('Creating');
      let user = new User({username: username, password: password});
      user.save((err) => {
          if (err) return next(createError(500, 'Db error'));
          callback(null,user)
      }) 
  }
}


module.exports = mongoose.model('User', schema);
