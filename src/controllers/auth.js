const jwt = require('jsonwebtoken')
const User = require('../models/user')
const errorHandler = require('../helpers/dbErrorHandler')

const signup = async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        user.password = undefined  //exclude certain fields from sending to the client
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findByCredentials(email, password)  //find user by email and password
        const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET) //generate JWT token for that user
        res.cookie('t', token, {expire: new Date() + 10000})
        user.password = undefined
        res.send({token, user})  
    } catch (err) {
        res.status(400).send({error: 'Incorrect email or password.'})
    }
    
}

const logout = async (req, res) => {
    res.clearCookie('t')
    res.status(200).send('Signout success!')
}

module.exports = {
    signup,
    login,
    logout
}