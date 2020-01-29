const mongoose = require('mongoose')
const validator = require('validator')

const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    price: {
        type: Number,
        required: true,
        maxlength: 15
    },
    sizes: {
        type: Array,
        required: true
    },
    selectedSize: {
        type: String,
        require: true
    },
    colors: {
        type: Array
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean,
        required: true
    }
}
, {timestamps: true})





const Product = mongoose.model ('Product', productSchema)
module.exports = Product