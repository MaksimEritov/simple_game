const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema')
const auth = require('./auth')

/**
 * GET routes
 * 
 */
router.get('/signIn', function(req, res, next) {
  res.render('signIn', { title: 'Sign In' });
});

router.get('/registration', function(req, res, next) {
  res.render('reg', { title: 'Registration' });
});

router.get('/chat', auth.required, function(req, res, next) {
  res.render('index', { title: 'Chat' });
});

router.get('/', auth.required, function(req, res, next) {
  res.redirect('/chat')
});

/**
 * 
 * Api routes
 * 
 */
router.use('/api', require('./api'));




module.exports = router;
