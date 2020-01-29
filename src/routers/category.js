const express = require('express')
const {create, read, list, update, remove} = require('../controllers/category')
const {authUser,isAuthed, isAdmin, getUserById} = require('../middleware/user')
const {getCategoryById} = require('../middleware/category')

const router = new express.Router()

//middleware operations
router.param('userId', getUserById)
router.param('categoryId', getCategoryById)

//CRUD operations
router.post('/category/create/:userId', authUser, isAuthed, isAdmin, create)
router.get('/category/:categoryId', read)
router.get('/categories', list)
router.patch('/category/:categoryId/:userId', authUser, isAuthed, isAdmin, update)
router.delete('/category/:categoryId/:userId', authUser, isAuthed, isAdmin, remove)

module.exports = router