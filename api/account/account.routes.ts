const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { getAccounts } = require('./account.controller')

const router = express.Router()

router.get('/', requireAuth, getAccounts)

module.exports = router

// fixing `Cannot redeclare block-scoped variable 'express'` --> adding export {}
export { }