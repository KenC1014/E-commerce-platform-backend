const {Order} = require('../models/order')

const getOrderById = async (req, res, next, id) => {
    try {
        const order = await Order.findById(id).populate('products.product',"name price")
        if(!order) {
            throw new Error ('Order not found')
        }
        req.order = order
        next()
    } catch (err) {
        res.status(400).send({error: 'Order not found'})
    }
}

module.exports = {
    getOrderById 
}