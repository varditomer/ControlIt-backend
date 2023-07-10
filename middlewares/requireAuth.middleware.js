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

  try {
    const userInfo = authService.verifyToken(token)
    req.userInfo = userInfo // Attach userInfo to the request object
    next()
  } catch (error) {
    return res.status(401).send('Not Authenticated')
  }
}


module.exports = {
  requireAuth,
}
