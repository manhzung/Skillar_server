const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const verifyCallbackWithRoles = (req, resolve, reject, allowedRoles) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (allowedRoles.length) {
    const hasAllowedRole = allowedRoles.includes(user.role);
    // Allow access if user has the required role OR if accessing their own resource
    if (!hasAllowedRole && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  // Check if the first argument is an array of roles
  const isRoleBased = requiredRights.length === 1 && Array.isArray(requiredRights[0]);
  
  return new Promise((resolve, reject) => {
    if (isRoleBased) {
      // Use role-based verification
      const allowedRoles = requiredRights[0];
      passport.authenticate('jwt', { session: false }, verifyCallbackWithRoles(req, resolve, reject, allowedRoles))(req, res, next);
    } else {
      // Use permission-based verification (existing behavior)
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    }
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
