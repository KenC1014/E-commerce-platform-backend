const expressJwt = require('express-jwt')
const User = require('../models/user')

const authUser = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
})

const isAuthed = (req, res, next) => {
    const isAuthed = req.profile && req.auth && (req.profile._id.toString() === req.auth._id.toString())
    if(!isAuthed) {
        return res.status(403).send({error:'access denied! please log in'})
    }
    next()
}

const isAdmin = (req, res, next) => {
    if(req.profile.role === 'customer') {
        return res.status(403).send({error: 'Admin access only'})
    }
    next()
}

const getUserById = async (req, res, next, id) => {
    try{
        const user = await User.findById(id)
        if(!user) {
            throw new Error({error: 'user does not exist'})
        }
        req.profile = user
        next()
    } catch (err) {
        res.status(400).send({error: 'user not found'})
    }
}

const addOrderToUserHistory = async (req, res, next) => {
    let history = []

    req.body.order.products.forEach((product) => {
        history.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        })
    })

    try {
        await User.findOneAndUpdate({_id: req.profile._id}, {$push: {history: history}}, {new: true})
        next()
    } catch (err) {
        res.status(400).send({error: "Unable to update user history"})
    }
}

module.exports = {
    authUser,
    isAuthed,
    isAdmin,
    getUserById,
    addOrderToUserHistory
}