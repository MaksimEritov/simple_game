/**
 * Mongo Db conection via mongoose
 * 
 * @export mongoouse.promise
 * 
 */

const mongoose = require('mongoose');

mongoose.connect('mongodb://node-chat:fefdi2ki@ds051841.mlab.com:51841/heroku_ncl8xtb4', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:')); 

module.exports = mongoose
