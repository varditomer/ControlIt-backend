const authService = require('../api/auth/auth.service')
const logger = require('../services/logger.service')

// Require auth middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization']

  // splits the Authorization header value into an array of strings based on whitespace. 
  // used when the header value follows the format Bearer <token>
  const loginToken = authHeader && authHeader.split(' ')[1]

  if (!loginToken) {
    return res.status(401).send('Not Authenticated')
  }

  const userInfo = authService.verifyToken(loginToken)
  if (!userInfo) {
    logger.warn(`token verification failed due to expiry or token abuse`)
    return res.status(401).send('Not Authenticated')
  }
  req.userInfo = userInfo // Attach userInfo to the request object
  next()
}


module.exports = {
  requireAuth,
}
