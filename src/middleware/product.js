const Product = require('../models/product')

const getProductById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id).populate('category')
        if(!product) {
            throw new Error ('Product not found')
        }
        req.product = product
        next()
    } catch (err) {
        res.status(400).send({error: 'Product not found'})
    }
}

const getPhoto = async (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.status(200).send(req.product.photo.data)
    }
    next()
}

const updateQuantity = async (req, res, next) => {
    let upToDate = req.body.order.products.map((product) => {
        return {
            updateOne: {
                filter: {_id: product._id},
                update: {$inc: {quantity: -product.count, sold: +product.count}}
            }
        }
    })

    try {
        await Product.bulkWrite(upToDate, {})
        console.log('quantity success')
        next()
    } catch (err) {
        console.log('failure')
        return res.status(400).send({error: 'Unable to update quantity'})
    }
}

module.exports = {
    getProductById,
    getPhoto,
    updateQuantity
}