const authService = require('../api/auth/auth.service')
const logger = require('../services/logger.service')

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization']

  // splits the Authorization header value into an array of strings based on whitespace. 
  // used when the header value follows the format Bearer <token>
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).send('Not Authenticated')
  }

  const userInfo = authService.verifyToken(token)
  if (!userInfo) {
    return res.status(401).json({ error: 'TokenVerificationError', message: 'Failed to verify token' })
  }
  else {
    req.userInfo = userInfo // Attach userInfo to the request object
    next()
  }

}

module.exports = {
  requireAuth,
}
