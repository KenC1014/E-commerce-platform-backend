const User = require('../models/user')
const braintree = require('braintree')

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey:  process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

const generateToken = async (req, res) => {
    try {
        const token = await gateway.clientToken.generate({})
        res.status(200).send(token)
    } catch (err) {
        res.status(500).send({error: err})
    }
}

const processPayment = (req, res) => {
    let methodFromClient = req.body.paymentMethod
    let amountFromClient = req.body.amount

    let newTransaction = gateway.transaction.sale({
        amount : amountFromClient,
        paymentMethodNonce: methodFromClient,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => {
        if (err) {
            res.status(500).send({error: err})
        } else {
            res.status(200).send(result)
        }
    })
}

module.exports = {
    generateToken,
    processPayment
}