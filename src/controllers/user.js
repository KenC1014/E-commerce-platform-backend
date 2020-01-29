const User = require('../models/user')
const {Order} = require('../models/order')
const errorHandler = require('../helpers/dbErrorHandler')

const read = async (req, res) => {
    req.profile.password = undefined
    res.status(200).send(req.profile)
}

const update = async (req, res) => {
    try {
        let updatedUser = await User.findById(req.profile._id)
        updatedUser.name = req.body.name
        updatedUser.email = req.body.email
        updatedUser.password = req.body.password
        await updatedUser.save()
        updatedUser.password = undefined
        res.status(200).send(updatedUser)
    } catch (err) {
        res.status(400).send({error: 'User not found'})
    }
}

const getPurchaseHistory = async (req, res) => {
    try {
        const orders = await Order.find({user: req.profile._id})
        .populate('user', '_id name')
        .sort('-created')
        res.status(200).send(orders)
    } catch (err) {
        res.status(400).send({error: 'Unable to find orders'})
    }
}

module.exports = {
    read,
    update,
    getPurchaseHistory
}