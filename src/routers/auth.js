const express = require('express')
const {signup, login, logout}  = require('../controllers/auth')

const router = new express.Router()

//define the 3 routes related to authenticating a user
router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)

module.exports = router