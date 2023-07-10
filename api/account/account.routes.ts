const express = require('express')
const { requireAuth, requireOwnership } = require('../../middlewares/requireAuth.middleware')
const { getAccounts, getTweet, addTweet, updateTweet, deleteTweet, retweet, getHashtags, updateHashtags } = require('./account.controller')

const router = express.Router()

router.get('/', requireAuth, getAccounts)
router.get('/:id', getTweet)
router.post('/', requireAuth, addTweet)
router.post('/retweet', requireAuth, retweet)
router.put('/hashtag', requireAuth, updateHashtags)
router.put('/:id', requireAuth, updateTweet)
router.delete('/:id', requireAuth, requireOwnership, deleteTweet)

module.exports = router

// fixing `Cannot redeclare block-scoped variable 'express'` --> adding export {}
export { }