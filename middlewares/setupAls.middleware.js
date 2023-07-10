const authService = require('../api/auth/auth.service')
const asyncLocalStorage = require('../services/als.service')

async function setupAsyncLocalStorage(req, res, next) {
  const storage = {}
  asyncLocalStorage.run(storage, () => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return next()
    const token = authHeader && authHeader.split(' ')[1]
    const userInfo = authService.verifyToken(token)

    if (userInfo) {
      const alsStore = asyncLocalStorage.getStore()
      alsStore.userInfo = userInfo
    }
    next()
  })
}

module.exports = setupAsyncLocalStorage

