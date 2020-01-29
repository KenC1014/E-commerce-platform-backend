const {Order, CartItem} = require('../models/order')
const errorHandler = require('../helpers/dbErrorHandler')

const create = async (req, res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    try {
        await order.save()
        res.status(201).send(order)
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

const listOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        .populate('user', "_id name address postalCode city")
        .sort("-created")
        res.status(200).send(orders)
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

const getStatusValues = async (req, res) => {
    res.send(Order.schema.path('status').enumValues)
}

const updateOrderStatus = async (req, res) => {
    try {
        const updatedOrder = await Order.update({_id: req.body.orderId}, {$set: {status: req.body.status}})
        res.status(200).send(updatedOrder)
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

module.exports = {
    create,
    listOrders,
    getStatusValues,
    updateOrderStatus
}