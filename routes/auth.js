/**
 * Authentication params
 * 
 * @exports auth middleware|object auth.required|auth.optional
 * 
 */

const jwt = require('express-jwt');
const secret = require('../config/secret').secret

/**
 * 
 * Functions to read token from header and cookie. Optional
 * 
 * getTokenFromHeaders()
 * getTokenFromCookies()
 * 
 * @param req|request 
 */

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const getTokenFromCookies = (req) => {
  return req.cookies.token ? req.cookies.token : null
};

const auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromCookies,
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromCookies,
    credentialsRequired: false,
  }),
};

module.exports = auth;