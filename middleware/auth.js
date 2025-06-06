/**
 * Authentication middleware
 * Ensures routes are protected and only accessible to authenticated users
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({message: 'Unauthorized access'});
}

module.exports = ensureAuthenticated;