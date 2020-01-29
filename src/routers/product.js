const express = require('express')
const {create, read, list, listRelated, listCategories, listBySearch, listSearch, remove, update} = require('../controllers/product')
const {authUser,isAuthed, isAdmin, getUserById} = require('../middleware/user')
const {getProductById, getPhoto} = require('../middleware/product')

const router = new express.Router()

//middleware operations
router.param('userId', getUserById)
router.param('productId', getProductById)

//CRUD operations
router.post('/product/create/:userId', authUser, isAuthed, isAdmin, create)
router.post('/products/by/search', listBySearch);
router.get('/product/:productId', read)
router.get('/products', list)
router.get('/products/related/:productId', listRelated)
router.get('/products/categories', listCategories)
router.get('/products/search', listSearch);
router.get('/product/photo/:productId', getPhoto)
router.patch('/product/:productId/:userId', authUser, isAuthed, isAdmin, update)
router.delete('/product/:productId/:userId', authUser, isAuthed, isAdmin, remove)

module.exports = router