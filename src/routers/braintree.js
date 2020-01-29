const express = require('express')
const {authUser, isAuthed, getUserById} = require('../middleware/user')
const {generateToken, processPayment} = require('../controllers/braintree')
const router = new express.Router()

router.param('userId', getUserById)

router.get('/braintree/getToken/:userId', authUser, isAuthed, generateToken)
router.post('/braintree/payment/:userId', authUser, isAuthed, processPayment)

module.exports = router