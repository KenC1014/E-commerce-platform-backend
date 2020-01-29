const express = require('express')
const {read, update, getPurchaseHistory} = require('../controllers/user')
const {authUser,isAuthed, isAdmin, getUserById} = require('../middleware/user')

const router = new express.Router()

router.param('userId', getUserById)

//CRUD operations
router.get('/user/:userId',authUser, isAuthed, read)
router.get('/orders/by/user/:userId',authUser, isAuthed, getPurchaseHistory)
router.patch('/user/:userId',authUser, isAuthed, update)
module.exports = router

