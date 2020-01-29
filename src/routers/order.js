const express = require('express')
const {authUser, isAuthed, isAdmin, getUserById, addOrderToUserHistory} = require('../middleware/user')
const {create, listOrders, getStatusValues, updateOrderStatus} = require('../controllers/order')
const {updateQuantity} = require('../middleware/product')
const {getOrderById} = require('../middleware/order')
const router = new express.Router()

router.param('userId', getUserById)
router.param('orderId', getOrderById)

//CRUD operations
router.post('/order/create/:userId', authUser, isAuthed, addOrderToUserHistory, updateQuantity, create)
router.get('/order/list/:userId', authUser, isAuthed, isAdmin, listOrders)
router.get('/order/statusvalues/:userId', authUser, isAuthed, isAdmin, getStatusValues)
router.patch('/order/:orderId/status/:userId', authUser, isAuthed, isAdmin, updateOrderStatus)


module.exports = router